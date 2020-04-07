import React, { useState, useEffect } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../AppNav';
import UserCard from '../components/UserCard';
import { User, SubUser } from '../interfaces/User';
import firestore from '@react-native-firebase/firestore';
import PoemCard from '../components/PoemCard';
import { ActivityIndicator } from 'react-native-paper';

type PoemDetailNavigationProp = StackNavigationProp<
    HomeStackParamList,
    'UserDetail'
>;

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
    let temp: User = { email: '', id: props.route.params!.profileUser.id, username: props.route.params!.profileUser.username, followers: [], following: [], poems: [], preferredLanguages: [] };
    const [theUser, setTheUser] = useState<User>(temp);

    useEffect(() => {
        let func = async () => {
            let tempUser = await firestore().collection('users').doc(props.route.params!.profileUser.id).get();
            let userData = tempUser.data() as User;
            setTheUser(userData);
        }
        func();
    }, [props.user]);
    
    return (
        <View>
            <UserCard
                theUserProp={theUser}
            />
            {
                theUser.email !== '' ?
                <FlatList
                    keyExtractor={(_i, index) => index.toString()}
                    data={theUser.poems.sort((a, b) => b.poemId - a.poemId)}
                    renderItem={({ item }) => (
                        <PoemCard item={item} navigation={props.navigation} full={false} />
                    )}
                />
                :
                <ActivityIndicator style={styles.loading} size={50} />
            }
        </View>
    )
}

export default connector(UserDetail);

const styles = StyleSheet.create({
    loading: {
        marginTop: 40
    }
});
