import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../AppNav';
import UserCard from '../components/UserCard';
import { User } from '../interfaces/User';
import firestore from '@react-native-firebase/firestore';
import PoemCard from '../components/PoemCard';
import { ActivityIndicator } from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import { usersCollectionId } from '../constants/collection';
import { Poem } from '../interfaces/Poem';

type PoemDetailNavigationProp = StackNavigationProp<HomeStackParamList, 'UserDetail'>;

type PoemDetailRouteProp = RouteProp<HomeStackParamList, 'UserDetail'>;

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems,
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    navigation: PoemDetailNavigationProp;
    route: PoemDetailRouteProp;
};

function UserDetail(props: Props) {
    let temp: User = {
        email: '',
        topics: [],
        blockedUsers: [],
        totalPoems: 0,
        uid: props.route.params!.profileUser.uid,
        bookmarks: [],
        docid: props.route.params!.profileUser.docid,
        username: props.route.params!.profileUser.username,
        followers: [],
        following: [],
        poems: [],
        preferredLanguages: [],
    };
    const [theUser, setTheUser] = useState<User>(temp);

    const [refresh, setRefresh] = useState(false);
    const [scrolling, setScrolling] = useState(false);

    const fetchPoems = async (fetchAfter = false) => {
        try {
            let res;
            let tempUser = await firestore().collection(usersCollectionId).doc(props.route.params!.profileUser.docid).get();
            if(fetchAfter && scrolling){
                let lastpoem = theUser.poems[theUser.poems.length - 1];
                res = await firestore().collection(usersCollectionId).doc(props.route.params!.profileUser.docid).collection("userpoems").orderBy("date", "desc").startAfter(lastpoem.date).limit(6).get()
            }
            else {
                res = await firestore().collection(usersCollectionId).doc(props.route.params!.profileUser.docid).collection("userpoems").orderBy("date", "desc").limit(6).get()
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
                let usrPoems = [...theUser.poems];
                poems.forEach((i) => (usrPoems.push(i)));
                let tempusr = {...tempUser.data()};
                tempusr.poems = usrPoems;
                setTheUser(tempusr as User);
            }
            else{
                let tempusr = {...tempUser.data()};
                tempusr.poems = poems;
                setTheUser(tempusr as User);
            }
        } catch (e) {
            setRefresh(false);
            Toast.show('Please check your internet connection!');
            console.log(e);
        }
    };

    useEffect(() => {
        let func = async () => {
            await fetchPoems()
        };
        func();
    }, [props.user]);

    return (
        <View style={{ flex: 1 }}>
            <UserCard theUserProp={theUser} navigation={props.navigation} />
            {theUser.email !== '' ? (
                <FlatList
                    keyExtractor={(_i, index) => index.toString()}
                    data={theUser.poems.sort((a, b) => b.date - a.date)}
                    onEndReached={async ({distanceFromEnd}) => {
                        if(distanceFromEnd != 0 && theUser.poems.length > 4)
                            await fetchPoems(true);
                    }}
                    onMomentumScrollBegin={() => setScrolling(true)}
                    onEndReachedThreshold={0.1}
                    renderItem={({ item }) => <PoemCard item={item} navigation={props.navigation} full={false} />}
                />
            ) : (
                <ActivityIndicator style={styles.loading} size={50} />
            )}
        </View>
    );
}

export default connector(UserDetail);

const styles = StyleSheet.create({
    loading: {
        marginTop: 40,
    },
});
