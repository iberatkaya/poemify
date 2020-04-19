import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import { User } from '../../interfaces/User';
import { connect, ConnectedProps } from 'react-redux';
import { setUser } from '../../redux/actions/User';
import { RootState } from '../../redux/store';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import { usersCollectionId, poemsCollectionId } from '../../constants/collection';
import { ProfileStackParamList } from '../../AppNav';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

type EnteranceScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'DeleteAccount'>;

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
    navigation: EnteranceScreenNavigationProp;
};

function DeleteAccount(props: Props) {
    const [loading, setLoading] = useState(false);

    if(loading){
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <ActivityIndicator style={{marginTop: 24}} size={50} />
            </ScrollView>
        )
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Are you sure you want to delete your account?</Text>
            <Button
                mode="contained"
                dark={true}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                onPress={async () => {
                    try{
                        setLoading(true);

                        //Delete from firestore first because user needs to be auth in order to delete
                        let userres = await firestore().collection(usersCollectionId).doc(props.user.docid).get();
                        let bookres = await userres.ref.collection('userbookmarks').get();
                        bookres.docs.forEach(async (i) => ( await i.ref.delete() ));
                        userres.ref.delete();
                        let poemres = await firestore().collection(poemsCollectionId).where('username', '==', props.user.username).get();
                        poemres.docs.forEach(async (i) => ( await i.ref.delete() ));

                        //Delete from firebase auth
                        if(auth().currentUser !== null && await auth().currentUser !== undefined)
                            await auth().currentUser?.delete();
 
                        //Logout user from app 
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
        
                    } catch(e){
                        console.log(e);
                    }
                }}
            >
                Delete Account
            </Button>
            <Button
                mode="contained"
                dark={true}
                labelStyle={styles.buttonLabel}
                onPress={async () => {
                    props.navigation.pop(2);
                }}
            >
                No
            </Button>

        </ScrollView>
    );
}

export default connector(DeleteAccount);

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingBottom: 16,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 32,
    },
    button: {
        marginVertical: 16
    },
    buttonLabel: {
        paddingVertical: 6,
    },
});
