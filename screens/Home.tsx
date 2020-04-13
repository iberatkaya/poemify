import React, { useEffect, useState, createRef } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Platform } from 'react-native';
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
import { usersCollectionId, poemsCollectionId, production } from '../constants/collection';
import RNBootSplash from 'react-native-bootsplash';
import AsyncStorage from '@react-native-community/async-storage';
import { InterstitialAd, RewardedAd, BannerAdSize, BannerAd, TestIds } from '@react-native-firebase/admob';
import { myinterstitial, myinterstitialios } from '../constants/ads';
import RNPickerSelect from 'react-native-picker-select';

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

    const interstitial = InterstitialAd.createForAdRequest(production ? (Platform.OS === 'ios' ? myinterstitialios : myinterstitial) : TestIds.INTERSTITIAL);
    interstitial.load()

    const [refresh, setRefresh] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const [ctr, setCtr] = useState(0);
    const [topic, setTopic] = useState("all");

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
            console.log(e.message);
        }
    };


    useEffect(() => {
        RNBootSplash.hide({ duration: 500 });
    }, []);

    useEffect(() => {
        setRefresh(true);
        let myfetch = async () => {
        //    await fetchPoems();
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
            <FAB onPress={async () => {
                if(ctr === 1 || ctr === 4 || ctr === 7){
                    await interstitial.show()
                }
                setCtr(ctr + 1);
                props.navigation.push('WritePoem');
                }} style={styles.fab} icon="circle-edit-outline" />
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

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    inputAndroid: {},
});