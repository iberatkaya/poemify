import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import PoemCard from '../components/PoemCard';
import { connect, ConnectedProps } from 'react-redux';
import { FAB, IconButton } from 'react-native-paper';
import { setPoem } from '../redux/actions/Poem';
import { setUser } from '../redux/actions/User';
import { RootState } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { HomeStackParamList } from '../AppNav';
import firestore from '@react-native-firebase/firestore';
import { Poem } from '../interfaces/Poem';
import { User } from '../interfaces/User';

type HomeScreenNavigationProp = CompositeNavigationProp<
    DrawerNavigationProp<{ Home: undefined }, 'Home'>,
    StackNavigationProp<HomeStackParamList>
>

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems,
});

const mapDispatch = {
    setPoem,
    setUser
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    navigation: HomeScreenNavigationProp;
};

function Home(props: Props) {
    props.navigation.setOptions({
        headerLeft: () => {
            return (
                <IconButton icon="menu"
                    onPress={() => {
                        props.navigation.openDrawer();
                    }} />
            );
        },
    });


    const fetchPoems = async () => {
        let res = await firestore().collection('users').get();
        let data = res.docs;
        let poems: Poem[] = data.map((i) => {
            let temp = i.data();
            let arr: Poem[] = temp.poems.map((j) => ({
                author: j.author,
                body: j.body,
                date: j.date,
                language: j.language,
                likes: j.likes,
                poemId: j.poemId,
                title: j.title
            }));
            return arr;
        }).flat()
        props.setPoem(poems);
        console.log('setted');
    }


    let fetchSelf = async () => {
        let res = await firestore().collection('users').where('email', '==', props.user.email).get();
        let user = { ...res.docs[0].data() , id: res.docs[0].data().id };
        console.log(user);
        props.setUser(user as User);
    }


    useEffect(() => {
        console.log('use')
        fetchPoems();/* 
        fetchSelf(); */
    }, []);


    return (
        <View style={styles.container}>
            <FlatList
                keyExtractor={(_i, index) => index.toString()}
                data={props.poems.sort((a, b) => b.date - a.date)}
                renderItem={({ item }) => (
                    <PoemCard item={item} navigation={props.navigation} full={false} />
                )}
            />
            <FAB onPress={() => props.navigation.push('WritePoem')} style={styles.fab} icon="plus" />
        </View>
    );
}

export default connector(Home);

const styles = StyleSheet.create({
    container: {
        height: '100%'
    },
    fab: {
        position: 'absolute',
        marginRight: 16,
        marginBottom: 12,
        right: 0,
        bottom: 0,
    },
});
