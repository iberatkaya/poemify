import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import PoemCard from '../components/PoemCard';
import { connect, ConnectedProps } from 'react-redux';
import { FAB, IconButton } from 'react-native-paper';
import { setPoem } from '../redux/actions/Poem';
import { setUser } from '../redux/actions/User';
import { RootState } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { HomeStackParamList, DrawerParamList } from '../AppNav';
import firestore from '@react-native-firebase/firestore';
import { Poem } from '../interfaces/Poem';
import { User } from '../interfaces/User';
import Toast from 'react-native-simple-toast';
import { usersCollectionId, poemsCollectionId } from '../constants/collection';
import RNBootSplash from "react-native-bootsplash";
import AsyncStorage from '@react-native-community/async-storage';

type HomeScreenNavigationProp = CompositeNavigationProp<
    DrawerNavigationProp<DrawerParamList, 'Tabs'>,
    StackNavigationProp<HomeStackParamList>
>;

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems,
});

const mapDispatch = {
    setPoem,
    setUser,
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
                <IconButton
                    icon="menu"
                    onPress={() => {
                        props.navigation.openDrawer();
                    }}
                />
            );
        },
    });


    const [refresh, setRefresh] = useState(false);

    const fetchPoems = async () => {
        try {
            setRefresh(true);
            let res = await firestore().collection(poemsCollectionId).where('language', 'in', props.user.preferredLanguages).get();
            let data = res.docs;
            let poems: Poem[] = data.map((i) => {
                let temp = i.data() as Poem;
                return temp;
            });
            props.setPoem(poems);
            setRefresh(false);
        } catch (e) {
            Toast.show('Please check your internet connection!');
            console.log(e);
        }
    };

    let fetchSelf = async () => {
        let res = await firestore().collection(usersCollectionId).where('email', '==', props.user.email).get();
        let user = { ...res.docs[0].data(), id: res.docs[0].data().id };
        props.setUser(user as User);
    };

    useEffect(() => {
        RNBootSplash.hide({ duration: 500 });
    }, [])

    useEffect(() => {
        let myfetch = async () => {
            await fetchSelf();
            await fetchPoems();
        }
        myfetch();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={async () => {
                            await fetchSelf();
                            await fetchPoems();
                            await AsyncStorage.setItem('user', JSON.stringify(props.user));
                        }}
                    />
                }
                keyExtractor={(_i, index) => index.toString()}
                data={props.poems.sort((a, b) => b.date - a.date)}
                renderItem={({ item }) => <PoemCard item={item} navigation={props.navigation} full={false} />}
            />
            <FAB onPress={() => props.navigation.push('WritePoem')} style={styles.fab} icon="plus" />
        </View>
    );
}

export default connector(Home);

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    fab: {
        position: 'absolute',
        marginRight: 16,
        marginBottom: 12,
        right: 0,
        bottom: 0,
    },
});
