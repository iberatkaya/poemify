import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import UserCard from '../components/UserCard';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/store';
import PoemCard from '../components/PoemCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../AppNav';
import { setUser, addUserBookmark } from '../redux/actions/User';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Poem } from '../interfaces/Poem';
import { User } from '../interfaces/User';
import Toast from 'react-native-simple-toast';
import { usersCollectionId, poemsCollectionId } from '../constants/collection';
import RNBootSplash from 'react-native-bootsplash';
import AsyncStorage from '@react-native-community/async-storage';

type PoemDetailNavigationProp = StackNavigationProp<ProfileStackParamList, 'Profile'>;

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems,
});

const mapDispatch = {
    setUser,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    navigation: PoemDetailNavigationProp;
};

function Profile(props: Props) {
    const [refresh, setRefresh] = useState(false);
    const [scrolling, setScrolling] = useState(false);

    let fetchSelf = async (fetchAfter = false) => {
        try {
            let res;
            let user = { ...props.user };
            if (fetchAfter) {
                let lastpoem = props.user.poems[props.user.poems.length - 1];
                res = await firestore()
                    .collection(poemsCollectionId)
                    .where("username", "==", props.user.username)
                    .orderBy('date', 'desc')
                    .startAfter(lastpoem.date)
                    .limit(8)
                    .get();
            } else {
                res = await firestore()
                    .collection(poemsCollectionId)
                    .where("username", "==", props.user.username)
                    .orderBy('date', 'desc')
                    .limit(8)
                    .get();
            }
            let fpoems = res.docs.map((i) => i.data() as Poem);
            if (fetchAfter) {
                let poems = [...props.user.poems];
                fpoems.forEach((i) => poems.push(i));
                user.poems = poems;
                props.setUser(user as User);
            } else {
                user.poems = fpoems;
                props.setUser(user);
            }
        } catch (e) {
            setRefresh(false);
            Toast.show('Please check your internet connection!');
            console.log(e);
        }
    };

    useEffect(() => {
        setRefresh(true);
        let myfetch = async () => {
            await fetchSelf();
            setRefresh(false);
        };
        myfetch();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <UserCard theUserProp={props.user} navigation={props.navigation} />
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={async () => {
                            setRefresh(true);
                            await fetchSelf();
                            await AsyncStorage.setItem('user', JSON.stringify(props.user));
                            setRefresh(false);
                        }}
                    />
                }
                onEndReached={async ({ distanceFromEnd }) => {
                    if (distanceFromEnd != 0 && props.poems.length > 4) await fetchSelf(true);
                }}
                onMomentumScrollBegin={() => setScrolling(true)}
                onEndReachedThreshold={0.1}
                keyExtractor={(_i, index) => index.toString()}
                data={props.user.poems.sort((a, b) => b.date - a.date)}
                renderItem={({ item }) => <PoemCard profile={true} item={item} navigation={props.navigation} full={false} />}
            />
        </View>
    );
}

export default connector(Profile);
