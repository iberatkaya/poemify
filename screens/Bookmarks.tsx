import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import PoemCard from '../components/PoemCard';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, ActivityIndicator } from 'react-native-paper';
import { BookmarkStackParamList } from '../AppNav';
import firestore from '@react-native-firebase/firestore';
import { setUser, addUserBookmark } from '../redux/actions/User';
import { User } from '../interfaces/User';
import Toast from 'react-native-simple-toast';
import { Poem } from '../interfaces/Poem';

type BookmarksScreenNavigationProp = StackNavigationProp<BookmarkStackParamList, 'Bookmarks'>;

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems,
});

const mapDispatch = {
    setUser,
    addUserBookmark
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    navigation: BookmarksScreenNavigationProp;
};

function Bookmarks(props: Props) {

    const [loading,setLoading] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const [refresh, setRefresh] = useState(false);

    let fetchBookmarks = async (fetchAfter = false) => {
        try {
            let res;
            if(fetchAfter && scrolling){
                let lastpoem = props.user.bookmarks[props.user.bookmarks.length - 1];
                res = await firestore().collection("usersdemo").doc(props.user.docid).collection("userbookmarks").orderBy("date", "desc").startAfter(lastpoem.date).limit(5).get();
            }
            else{
                res = await firestore().collection("usersdemo").doc(props.user.docid).collection("userbookmarks").orderBy("date", "desc").limit(5).get();

            }
            let books = res.docs;
            let bookmarks = books.map((i) => (i.data())) as Poem[];
            let usr: User = {...props.user};
            if(fetchAfter){
                bookmarks.forEach((i: Poem) => (props.addUserBookmark(i)));
            }
            else{
                usr.bookmarks = bookmarks;
                props.setUser(usr);
            }
        } catch (e) {
            Toast.show('Please check your internet connection!');
            console.log(e);
        }
    };


    useEffect(() => {
        let myfetch = async () => {
            setLoading(true);
            await fetchBookmarks();
            setLoading(false);
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
            {
                loading ? 
                <ActivityIndicator size={50} style={{marginTop: 40}} />
                :
                <FlatList
                    keyExtractor={(_i, index) => index.toString()}
                    data={props.user.bookmarks.sort((a, b) => b.date - a.date)}
                    onEndReached={async ({distanceFromEnd}) => {
                        if(distanceFromEnd != 0 && props.user.bookmarks.length > 4)
                            await fetchBookmarks(true);
                        }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={async () => {
                                setRefresh(true);
                                await fetchBookmarks();
                                setRefresh(false);
                            }}
                        />
                    }
                    onMomentumScrollBegin={() => setScrolling(true)}
                    onEndReachedThreshold={0.1}
                    renderItem={({ item }) => <PoemCard bookmark={true} item={item} navigation={props.navigation} full={false} />}
                />
            }
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
