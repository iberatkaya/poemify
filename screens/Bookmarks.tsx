import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import PoemCard from '../components/PoemCard';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'react-native-paper';
import { BookmarkStackParamList } from '../AppNav';
import firestore from '@react-native-firebase/firestore';
import { setUser } from '../redux/actions/User';
import { User } from '../interfaces/User';
import { usersCollectionId, poemsCollectionId } from '../constants/collection';
import Toast from 'react-native-simple-toast';
import { Poem } from '../interfaces/Poem';

type BookmarksScreenNavigationProp = StackNavigationProp<BookmarkStackParamList, 'Bookmarks'>;

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
    navigation: BookmarksScreenNavigationProp;
};

function Bookmarks(props: Props) {

    const [scrolling, setScrolling] = useState(false);

    let fetchBookmarks = async (fetchAfter = false) => {
        try {
            let res;
            if(fetchAfter && scrolling){
                let lastpoem = props.user.bookmarks[props.user.bookmarks.length - 1];
                res = await firestore().collection("usersdemo").doc(props.user.docid).collection("userbookmarks").orderBy("date", "desc").startAfter(lastpoem.date).limit(5).get()
            }
            else {
                res = await firestore().collection("usersdemo").doc(props.user.docid).collection("userbookmarks").orderBy("date", "desc").limit(5).get()
            }
            let books = res.docs;
            let bookmarks = books.map((i) => (i.data())) as Poem[];
            let usr: User = {...props.user};
            if(fetchAfter){
                let usrPoems = [...props.user.bookmarks];
                bookmarks.forEach((i: Poem) => (usrPoems.push(i)));
                usr.bookmarks = usrPoems;
                props.setUser(usr);
            }
            else{
                usr.bookmarks = bookmarks;
                props.setUser(usr);
            }
            props.setUser(usr);
        } catch (e) {
            Toast.show('Please check your internet connection!');
            console.log(e);
        }
    };


    useEffect(() => {
        let myfetch = async () => {
            await fetchBookmarks();
        };
        myfetch();
    }, []);

    return (
        <View
            style={styles.container}        >
            {props.user.bookmarks.length === 0 ? (
                <Text style={{ textAlign: 'center', fontSize: 20, paddingTop: 24, paddingHorizontal: 24 }}>
                    You don't have any bookmarked poems!
                </Text>
            ) : (
                <View />
            )}
            <FlatList
                keyExtractor={(_i, index) => index.toString()}
                data={props.user.bookmarks.sort((a, b) => b.date - a.date)}
                onEndReached={async ({distanceFromEnd}) => {
                    if(distanceFromEnd != 0 && props.user.bookmarks.length > 4)
                        await fetchBookmarks(true);
                }}
                onMomentumScrollBegin={() => setScrolling(true)}
                onEndReachedThreshold={0.1}
                renderItem={({ item }) => <PoemCard bookmark={true} item={item} navigation={props.navigation} full={false} />}
            />
        </View>
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
        marginTop: 40,
    },
});
