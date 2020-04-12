import React, { useEffect, useState, createRef } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import PoemCard from '../components/PoemCard';
import { connect, ConnectedProps } from 'react-redux';
import { FAB, IconButton, ActivityIndicator } from 'react-native-paper';
import { setPoem, addPoem } from '../redux/actions/Poem';
import { setUser, addUserBookmark } from '../redux/actions/User';
import { RootState } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { HomeStackParamList, DrawerParamList } from '../AppNav';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Poem } from '../interfaces/Poem';
import { User } from '../interfaces/User';
import Toast from 'react-native-simple-toast';
import { usersCollectionId, poemsCollectionId } from '../constants/collection';
import RNBootSplash from 'react-native-bootsplash';
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
    addPoem,
    setUser,
    addUserBookmark
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
    const [scrolling, setScrolling] = useState(false);

    const fetchPoems = async (fetchAfter = false) => {
        try {
            let res;
            if(fetchAfter && scrolling){
                let lastpoem = props.poems[props.poems.length - 1];
                res = await firestore()
                    .collection(poemsCollectionId)
                    .where('language', 'array-contains-any', props.user.preferredLanguages)
                    .orderBy('date', 'desc')
                    .orderBy('username', 'asc')
                    .startAfter(lastpoem.date, lastpoem.username)
                    .limit(8)
                    .get();        
            }
            else {
                res = await firestore()
                .collection(poemsCollectionId)
                .where('language', 'array-contains-any', props.user.preferredLanguages)
                .orderBy('date', 'desc')
                .orderBy('username', 'asc')
                .limit(8)
                .get();
            }
            let data = res.docs;
            let poems: Poem[] = data
                .map((i) => {
                    let temp = i.data() as Poem;
                    return temp;
                })
                .filter((j) => {
                    for (let k in props.user.blockedUsers) {
                        if (j.author.username === props.user.blockedUsers[k].username && j.author.uid === props.user.blockedUsers[k].uid) {
                            return false;
                        }
                    }
                    return true;
                });
            if(fetchAfter){
                poems.forEach((i) => props.addPoem(i));
            }
            else
                props.setPoem(poems);
        } catch (e) {
            setRefresh(false);
            Toast.show('Please check your internet connection!');
            if(e.message === "[firestore/permission-denied] The caller does not have permission to execute the specified operation."){
                console.log(true);
                let user: User = {
                    bookmarks: [],
                    totalPoems: 0,
                    topics: [],
                    docid: '-1',
                    uid: '',
                    email: '',
                    blockedUsers: [],
                    username: '',
                    poems: [],
                    preferredLanguages: [],
                    followers: [],
                    following: [],
                };
                props.setUser(user);
                await AsyncStorage.setItem('user', JSON.stringify(user));
            }
            console.log(e.message);
        }
    };


    useEffect(() => {
        RNBootSplash.hide({ duration: 500 });
    }, []);

    useEffect(() => {
        setRefresh(true);
        let myfetch = async () => {
            await fetchPoems();
            setRefresh(false);
        };
        myfetch();
    }, []);


    return (
        <View style={styles.container}>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={async () => {
                            setRefresh(true);
                            await fetchPoems();
                            await AsyncStorage.setItem('user', JSON.stringify(props.user));
                            setRefresh(false);
                        }}
                    />
                }
                onEndReached={async ({distanceFromEnd}) => {
                    if(distanceFromEnd != 0 && props.poems.length > 4)
                        await fetchPoems(true);
                }}
                onMomentumScrollBegin={() => setScrolling(true)}
                onEndReachedThreshold={0.1}
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
