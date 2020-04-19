import React, { useEffect, useState, createRef, useRef } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Platform } from 'react-native';
import PoemCard from '../components/PoemCard';
import { connect, ConnectedProps } from 'react-redux';
import { FAB, IconButton, Divider } from 'react-native-paper';
import { setPoem, addPoem } from '../redux/actions/Poem';
import { setUser, addUserBookmark } from '../redux/actions/User';
import { RootState } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { HomeStackParamList, DrawerParamList } from '../AppNav';
import firestore from '@react-native-firebase/firestore';
import { Poem } from '../interfaces/Poem';
import Toast from 'react-native-simple-toast';
import { poemsCollectionId, production, usersCollectionId } from '../constants/collection';
import RNBootSplash from 'react-native-bootsplash';
import AsyncStorage from '@react-native-community/async-storage';
import { InterstitialAd, TestIds } from '@react-native-firebase/admob';
import { myinterstitial, myinterstitialios } from '../constants/ads';
import RNPickerSelect from 'react-native-picker-select';
import { User } from '../interfaces/User';

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
    addUserBookmark,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    navigation: HomeScreenNavigationProp;
};

function Home(props: Props) {
    useEffect(() => {
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
    }, []);

    const interstitial = InterstitialAd.createForAdRequest(
        production ? (Platform.OS === 'ios' ? myinterstitialios : myinterstitial) : TestIds.INTERSTITIAL
    );
    interstitial.load();

    const [refresh, setRefresh] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const [ctr, setCtr] = useState(0);
    const [topic, setTopic] = useState('all topics');
    const [lang, setLang] = useState(props.user.preferredLanguages[0]);
    const [atTop, setAtTop] = useState(true);

    const fetchPoems = async (fetchAfter = false) => {
        try {
            let res;
            if (fetchAfter && scrolling) {
                let lastpoem = props.poems[props.poems.length - 1];
                if (topic === 'all topics') {
                    res = await firestore()
                        .collection(poemsCollectionId)
                        .where('language', '==', lang)
                        .orderBy('date', 'desc')
                        .startAfter(lastpoem.date)
                        .limit(8)
                        .get();
                } else {
                    res = await firestore()
                        .collection(poemsCollectionId)
                        .where('language', '==', lang)
                        .where('topics', 'array-contains', topic)
                        .orderBy('date', 'desc')
                        .startAfter(lastpoem.date)
                        .limit(8)
                        .get();
                }
            } else {
                if (topic === 'all topics') {
                    res = await firestore()
                        .collection(poemsCollectionId)
                        .where('language', '==', lang)
                        .orderBy('date', 'desc')
                        .limit(8)
                        .get();
                } else {
                    res = await firestore()
                        .collection(poemsCollectionId)
                        .where('language', '==', lang)
                        .where('topics', 'array-contains', topic)
                        .orderBy('date', 'desc')
                        .limit(8)
                        .get();
                }
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
            if (fetchAfter) {
                poems.forEach((i) => props.addPoem(i));
            } else props.setPoem(poems);
        } catch (e) {
            setRefresh(false);
            Toast.show('Please check your internet connection!');
            console.log(e.message);
        }
    };

    let fetchUser = async () => {
        let res = await firestore()
                    .collection(usersCollectionId)
                    .doc(props.user.docid)
                    .get();
        let user = res.data() as User;
        props.setUser(user);
    }

    useEffect(() => {
        RNBootSplash.hide({ duration: 500 });
    }, []);

    useEffect(() => {
        fetchUser();
    }, [])

    useEffect(() => {
        setRefresh(true);
        let myfetch = async () => {
            await fetchPoems();
            setRefresh(false);
        };
        myfetch();
    }, [topic, lang]);

    const flistRef = createRef<FlatList>();

    const _onViewableItemsChanged = useRef((param: any) => {
        if(param === undefined)
            return;
        if (param.viewableItems.length > 0 && param.viewableItems[0].index === 0) {
            setAtTop(true);
        } else {
            setAtTop(false);
        }
    });

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

    return (
        <View style={styles.container}>
            <View style={styles.pickerRow}>
                <View style={styles.pickerContainer}>
                    <RNPickerSelect
                        onValueChange={(value) => {
                            setTopic(value);
                        }}
                        textInputProps={Platform.OS === "android" ? {textAlignVertical: 'center'} : undefined}
                        Icon={() => (<View/>)}
                        useNativeAndroidPickerStyle={false}
                        placeholder={{}}
                        style={pickerSelectStyles}
                        items={['all topics', ...props.user.topics].map((i) => ({ value: i, label: i }))}
                        value={topic}
                    />
                </View>
                <View style={{ width: 1, height: '100%', backgroundColor: '#ccc' }} />
                <View style={styles.pickerContainer}>
                    <RNPickerSelect
                        onValueChange={(value) => {
                            setLang(value);
                        }}
                        placeholder={{}}
                        Icon={() => (<View/>)}
                        useNativeAndroidPickerStyle={false}
                        style={pickerSelectStyles}
                        items={props.user.preferredLanguages.map((i) => ({ value: i, label: i }))}
                        value={lang}
                    />
                </View>
                <View style={{ width: 1, height: '100%', backgroundColor: '#ccc' }} />
                <View style={styles.pickerContainer}>
                    <IconButton
                        icon={atTop ? 'home' : 'arrow-up'}
                        size={24}
                        onPress={() => {
                            if (props.poems.length < 1) return;
                            flistRef.current?.scrollToIndex({ index: 0, animated: true });
                        }}
                    />
                </View>
            </View>
            <Divider style={{backgroundColor: '#ccc', height: 1}} />
            <FlatList
                ref={flistRef}
                viewabilityConfig={viewConfigRef.current}
                onViewableItemsChanged={_onViewableItemsChanged.current}
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
                onEndReached={async ({ distanceFromEnd }) => {
                    if (distanceFromEnd != 0 && props.poems.length > 4) await fetchPoems(true);
                }}
                onMomentumScrollBegin={() => setScrolling(true)}
                onEndReachedThreshold={0.1}
                keyExtractor={(_i, index) => index.toString()}
                data={props.poems.sort((a, b) => b.date - a.date)}
                renderItem={({ item }) => <PoemCard item={item} navigation={props.navigation} full={false} />}
            />
            <FAB
                onPress={async () => {
                    if (ctr === 1 || ctr === 4 || ctr === 7) {
                        try {
                            await interstitial.show();
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    setCtr(ctr + 1);
                    props.navigation.push('WritePoem');
                }}
                style={styles.fab}
                icon="circle-edit-outline"
            />
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
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    pickerContainer: {
        flex: 1,
        alignItems: 'center',
        textAlign: 'center',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        textAlign: 'center',
        fontSize: 16,
        paddingVertical: 4,
    },
    inputAndroid: {
        fontSize: 17,
        textAlign: 'center',
        color: '#222'
    },
    inputAndroidContainer: {
    }
});