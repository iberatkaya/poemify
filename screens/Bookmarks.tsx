import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import PoemCard from '../components/PoemCard';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, ActivityIndicator } from 'react-native-paper';
import { BookmarkStackParamList } from '../AppNav';
import firestore from '@react-native-firebase/firestore';
import { setUser } from '../redux/actions/User';
import { User } from '../interfaces/User';
import { usersCollectionId, poemsCollectionId } from '../constants/collection';

type BookmarksScreenNavigationProp = StackNavigationProp<BookmarkStackParamList, 'Bookmarks'>;

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems,
});

const mapDispatch = {
    setUser
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    navigation: BookmarksScreenNavigationProp;
};

function Bookmarks(props: Props) {
    let [loading, setLoading] = useState(true);

    let fetchSelf = async () => {
        try{
            setLoading(true);
            let res = await firestore().collection(usersCollectionId).where('email', '==', props.user.email).get();
            let user = { ...res.docs[0].data(), id: res.docs[0].data().id };
            props.setUser(user as User);
            setLoading(false);
        } catch(e){
            setLoading(false);
            console.log(e);
        }
    };

    useEffect(() => {
        fetchSelf();
    }, []);


    return (
        <ScrollView style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={async () => {
                        await fetchSelf();
                    }}
                />
            }
        >
            {
                props.user.bookmarks.length === 0 ?
                    <Text style={{ textAlign: 'center', fontSize: 20, paddingTop: 24, paddingHorizontal: 24 }}>You don't have any bookmarked poems!</Text>
                    :
                    <View />
            }
            <FlatList
                keyExtractor={(_i, index) => index.toString()}
                data={props.user.bookmarks.sort((a, b) => b.date - a.date)}
                renderItem={({ item }) => <PoemCard item={item} navigation={props.navigation} full={false} />}
            />
        </ScrollView>
    );
}

export default connector(Bookmarks);

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
    loading: {
        marginTop: 40
    }
});
