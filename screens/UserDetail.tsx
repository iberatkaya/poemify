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

    useEffect(() => {
        let func = async () => {
            let tempUser = await firestore().collection(usersCollectionId).doc(props.route.params!.profileUser.docid).get();
            let userData = tempUser.data() as User;
            if (userData === undefined) {
                Toast.show("User doesn't exist!");
                //                await firestore().collection(usersCollectionId);
                props.navigation.pop();
                return;
            }
            setTheUser(userData);
        };
        func();
    }, [props.user]);

    return (
        <View>
            <UserCard theUserProp={theUser} navigation={props.navigation} />
            {theUser.email !== '' ? (
                <FlatList
                    keyExtractor={(_i, index) => index.toString()}
                    data={theUser.poems.sort((a, b) => b.poemId - a.poemId)}
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
