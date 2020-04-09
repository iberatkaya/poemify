import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Card, Paragraph, Text, IconButton, Divider, Menu, Button, HelperText, TextInput, Avatar } from 'react-native-paper';
import { Poem } from '../interfaces/Poem';
import { connect, ConnectedProps } from 'react-redux';
import { User } from '../interfaces/User';
import { updatePoem, deletePoem, setPoem } from '../redux/actions/Poem';
import { updateUserPoem, deleteUserPoem, setUser } from '../redux/actions/User';
import { HomeStackParamList, ProfileStackParamList, BookmarkStackParamList, SearchStackParamList } from '../AppNav';
import { RootState } from '../redux/store';
import Toast from 'react-native-simple-toast';
import firestore from '@react-native-firebase/firestore';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { usersCollectionId, poemsCollectionId, reportCollectionId } from '../constants/collection';
import { Comment } from '../interfaces/Comment';
import millify from 'millify';
import { Report } from '../interfaces/Report';

type PoemCardScreenNavigationProp = StackNavigationProp<
    HomeStackParamList & ProfileStackParamList & BookmarkStackParamList & SearchStackParamList,
    'Bookmarks'
>;

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems,
});

const mapDispatch = {
    updatePoem,
    updateUserPoem,
    deletePoem,
    deleteUserPoem,
    setUser,
    setPoem,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    item: Poem;
    navigation: PoemCardScreenNavigationProp;
    full: boolean;
};

function PoemCard(props: Props) {
    const [lock, setLock] = useState(false);
    const [lockComment, setLockComment] = useState(false);
    const [lockBookmark, setLockBookmark] = useState(false);
    const [lockMenu, setLockMenu] = useState(false);
    const [menu, setMenu] = useState(false);
    const [myComment, setMyComment] = useState('');
    const [deleting, setDeleting] = useState(false);

    let userLiked = () => {
        for (let i in props.item.likes) {
            if (props.item.likes[i].username === props.user.username) {
                return true;
            }
        }
        return false;
    };

    let userBookmarked = () => {
        for (let i in props.user.bookmarks) {
            if (
                props.item.author.username === props.user.bookmarks[i].author.username &&
                props.item.poemId === props.user.bookmarks[i].poemId &&
                props.item.date === props.user.bookmarks[i].date
            ) {
                return true;
            }
        }
        return false;
    };

    const fetchPoems = async () => {
        try {
            let res = await firestore().collection(poemsCollectionId).where('language', 'in', props.user.preferredLanguages).get();
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
            props.setPoem(poems);
        } catch (e) {
            console.log(e);
        }
    };

    let _openMenu = () => setMenu(true);

    let _closeMenu = () => setMenu(false);

    TimeAgo.addLocale(en);

    const timeAgo = new TimeAgo('en-US');

    let blockUser = async () => {
        try {
            if (lockMenu) {
                Toast.show('Please wait for the request to be finished!');
                return;
            }
            _closeMenu();
            setLockMenu(true);
            let myuser = { ...props.user };
            myuser.blockedUsers.push({ ...props.item.author });

            //Remove blocked user from following and being followed
            myuser.followers = myuser.followers.filter(
                (i) => i.username !== props.item.author.username && i.docid !== props.item.author.docid
            );
            myuser.following = myuser.following.filter(
                (i) => i.username !== props.item.author.username && i.docid !== props.item.author.docid
            );
            props.setUser(myuser);
            await firestore()
                .collection(usersCollectionId)
                .doc(props.user.docid)
                .update({ blockedUsers: myuser.blockedUsers, followers: myuser.followers, following: myuser.following });

            if (props.full) props.navigation.pop();
            await fetchPoems();
            setLockMenu(false);
        } catch (e) {
            setLockMenu(false);
            Toast.show("We're sorry but an error occurred :(");
            console.log(e);
        }
    };

    return (
        <Card
            style={styles.cardContainer}
            onPress={() => {
                if (!props.full) props.navigation.push('PoemDetail', { poem: props.item });
            }}
        >
            <View style={styles.titleContainer}>
                <Text style={{ ...styles.cardTitle, flex: 2 }}>{props.item.title}</Text>
                <View style={{ flex: 0.25 }} /*  style={styles.menu} */>
                    <Menu visible={menu} onDismiss={_closeMenu} anchor={<IconButton icon="chevron-down" onPress={_openMenu} />}>
                        {props.user.username === props.item.author.username ? (
                            <Menu.Item
                                onPress={async () => {
                                    try {
                                        if (lockMenu) {
                                            Toast.show('Please wait for the request to be finished!');
                                            return;
                                        }
                                        _closeMenu();
                                        setLockMenu(true);
                                        let mypoems = [...props.user.poems];
                                        let myindex = mypoems.findIndex(
                                            (i) => i.poemId === props.item.poemId && i.author.username === props.item.author.username
                                        );
                                        if (myindex === -1) throw 'An error occurred!';
                                        mypoems.splice(myindex, 1);
                                        props.deleteUserPoem(props.item);
                                        props.deletePoem(props.item);
                                        await firestore().collection(usersCollectionId).doc(props.user.docid).update({ poems: mypoems });

                                        let req = await firestore()
                                            .collection(poemsCollectionId)
                                            .where('date', '==', props.item.date)
                                            .where('title', '==', props.item.title)
                                            .where('poemId', '==', props.item.poemId)
                                            .get();
                                        await firestore().collection(poemsCollectionId).doc(req.docs[0].id).delete();
                                        setLockMenu(false);
                                        if (props.full) props.navigation.pop();
                                    } catch (e) {
                                        Toast.show("We're sorry but an error occurred :(");
                                        setLockMenu(false);
                                        console.log(e);
                                    }
                                }}
                                title="Delete"
                            />
                        ) : (
                            <View>
                                <Menu.Item
                                    onPress={async () => {
                                        await blockUser();
                                    }}
                                    title="Block"
                                />
                                <Menu.Item
                                    onPress={async () => {
                                        try {
                                            _closeMenu();
                                            let resreport = await firestore()
                                                .collection(reportCollectionId)
                                                .where('date', '==', props.item.date)
                                                .where('poemId', '==', props.item.poemId)
                                                .where('author', '==', props.item.author.username)
                                                .get();
                                            if (resreport.empty) {
                                                let report: Report = {
                                                    amount: 1,
                                                    poem: props.item,
                                                    author: props.item.author.username,
                                                    date: props.item.date,
                                                    poemId: props.item.poemId,
                                                    reportedBy: [
                                                        { docid: props.user.docid, uid: props.user.uid, username: props.user.username },
                                                    ],
                                                };
                                                await firestore().collection(reportCollectionId).add(report);
                                            } else {
                                                let docid = resreport.docs[0].id;
                                                let report = resreport.docs[0].data() as Report;
                                                for (let i in report.reportedBy) {
                                                    if (
                                                        report.reportedBy[i].username === props.user.username &&
                                                        report.reportedBy[i].docid === props.user.docid
                                                    ) {
                                                        Toast.show('You already reported this poem!');
                                                        return;
                                                    }
                                                }
                                                await firestore()
                                                    .collection(reportCollectionId)
                                                    .doc(docid)
                                                    .update({ amount: report.amount + 1 });
                                            }
                                            await blockUser();
                                        } catch (e) {
                                            Toast.show("We're sorry but an error occurred :(");
                                            console.log(e);
                                        }
                                    }}
                                    title="Report"
                                />
                            </View>
                        )}
                    </Menu>
                </View>
            </View>
            <Divider style={{ marginBottom: 8 }} />
            <Card.Content>
                <Paragraph style={styles.bodyText}>
                    {props.item.body.split('\n').length > 8 && !props.full
                        ? props.item.body.split('\n').slice(0, 8).join('\n') + '\n...'
                        : props.item.body}
                </Paragraph>
                <Text style={styles.topics}>
                    #{props.item.topics[0]} #{props.item.topics[1]}
                </Text>
            </Card.Content>
            <Divider style={styles.divider} />
            <Card.Actions style={styles.actions}>
                <Paragraph
                    onPress={() =>
                        props.navigation.push('UserDetail', {
                            profileUser: { docid: props.item.author.docid, username: props.item.author.username, uid: props.user.uid },
                        })
                    }
                    style={styles.author}
                >
                    {props.item.author.username.length > 12 ? props.item.author.username.slice(0, 13) : props.item.author.username}
                </Paragraph>

                <Text style={styles.time}>{timeAgo.format(props.item.date)}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {userLiked() ? (
                        <IconButton
                            color="red"
                            icon="heart"
                            style={styles.icon}
                            size={20}
                            //@ts-ignore
                            onPress={async () => {
                                try {
                                    if (lock) return;
                                    setLock(true);
                                    let poem = { ...props.item };
                                    let myindex = poem.likes.findIndex((val) => val.username === props.user.username);
                                    poem.likes.splice(myindex, 1);
                                    if (myindex === -1) throw 'An error occurred!';

                                    /**
                                     * Redux Operations
                                     */

                                    props.updatePoem(poem);
                                    if (poem.author.username === props.user.username) {
                                        props.updateUserPoem(poem);
                                    }

                                    /**
                                     * Firebase Operations
                                     */

                                    let req = await firestore().collection(usersCollectionId).doc(props.item.author.docid).get();
                                    let userData = req.data() as User;

                                    let index = userData.poems.findIndex(
                                        (val) => val.poemId === props.item.poemId && val.author.username === props.item.author.username
                                    );
                                    if (index === -1) throw 'FIREBASE: An error occurred!';
                                    userData.poems[index].likes = poem.likes;
                                    await firestore()
                                        .collection(usersCollectionId)
                                        .doc(props.item.author.docid)
                                        .update({ poems: userData.poems });

                                    let req2 = await firestore()
                                        .collection(poemsCollectionId)
                                        .where('date', '==', props.item.date)
                                        .where('title', '==', props.item.title)
                                        .where('poemId', '==', props.item.poemId)
                                        .get();
                                    await firestore().collection(poemsCollectionId).doc(req2.docs[0].id).update({ likes: poem.likes });
                                    setLock(false);
                                } catch (e) {
                                    setLock(false);
                                    Toast.show("We're sorry but an error occurred :(");
                                    console.log(e);
                                }
                            }}
                        />
                    ) : (
                        <IconButton
                            icon="heart-outline"
                            style={styles.icon}
                            size={20}
                            //@ts-ignore
                            onPress={async () => {
                                try {
                                    if (lock) return;
                                    setLock(true);
                                    let poem = { ...props.item };
                                    poem.likes.push({ docid: props.user.docid, username: props.user.username, uid: props.user.uid });

                                    /**
                                     * Redux Operations
                                     */

                                    props.updatePoem(poem);
                                    if (poem.author.username === props.user.username) {
                                        props.updateUserPoem(poem);
                                    }

                                    /**
                                     * Firebase Operations
                                     */

                                    let req = await firestore().collection(usersCollectionId).doc(props.item.author.docid).get();
                                    let userData = req.data() as User;

                                    let index = userData.poems.findIndex(
                                        (val) => val.poemId === props.item.poemId && val.author.username === props.item.author.username
                                    );
                                    if (index === -1) throw 'FIREBASE: An error occurred!';
                                    userData.poems[index].likes = poem.likes;
                                    await firestore()
                                        .collection(usersCollectionId)
                                        .doc(props.item.author.docid)
                                        .update({ poems: userData.poems });

                                    let req2 = await firestore()
                                        .collection(poemsCollectionId)
                                        .where('date', '==', props.item.date)
                                        .where('title', '==', props.item.title)
                                        .where('poemId', '==', props.item.poemId)
                                        .get();
                                    await firestore().collection(poemsCollectionId).doc(req2.docs[0].id).update({ likes: poem.likes });

                                    setLock(false);
                                } catch (e) {
                                    setLock(false);
                                    Toast.show("We're sorry but an error occurred :(");
                                    console.log(e);
                                }
                            }}
                        />
                    )}
                    <Text style={styles.likeText}>{millify(props.item.likes.length, { lowerCase: true })}</Text>
                    {userBookmarked() ? (
                        <IconButton
                            style={styles.icon}
                            icon="bookmark"
                            color="black"
                            //@ts-ignore
                            onPress={async () => {
                                try {
                                    if (lockBookmark) return;
                                    setLockBookmark(true);

                                    let user = { ...props.user };
                                    let myindex = user.bookmarks.findIndex(
                                        (i) => i.poemId === props.item.poemId && i.date === props.item.date
                                    );
                                    if (myindex === -1) throw 'An error occurred';
                                    /**
                                     * Redux Operations
                                     */

                                    user.bookmarks.splice(myindex, 1);

                                    props.setUser(user);

                                    /**
                                     * Firebase Operations
                                     */

                                    let req = await firestore()
                                        .collection(usersCollectionId)
                                        .doc(props.user.docid)
                                        .update({ bookmarks: user.bookmarks });

                                    setLockBookmark(false);
                                } catch (e) {
                                    setLockBookmark(false);
                                    Toast.show("We're sorry but an error occurred :(");
                                    console.log(e);
                                }
                            }}
                        />
                    ) : (
                        <IconButton
                            style={styles.icon}
                            icon="bookmark-outline"
                            //@ts-ignore
                            onPress={async () => {
                                try {
                                    if (lockBookmark) return;
                                    setLockBookmark(true);

                                    let user = { ...props.user };
                                    user.bookmarks.push(props.item);

                                    /**
                                     * Redux Operations
                                     */

                                    props.setUser(user);

                                    /**
                                     * Firebase Operations
                                     */

                                    let req = await firestore()
                                        .collection(usersCollectionId)
                                        .doc(props.user.docid)
                                        .update({ bookmarks: user.bookmarks });

                                    setLockBookmark(false);
                                } catch (e) {
                                    setLockBookmark(false);
                                    Toast.show("We're sorry but an error occurred :(");
                                    console.log(e);
                                }
                            }}
                        />
                    )}
                </View>
            </Card.Actions>
            <Divider style={styles.divider} />
            {props.full ? (
                <View style={styles.commentContainer}>
                    <View style={styles.commentInput}>
                        <TextInput
                            mode="outlined"
                            style={{ flex: 5, fontSize: 12, height: 32 }}
                            value={myComment}
                            onChangeText={(val) => setMyComment(val)}
                        />
                        <Button
                            loading={lockComment}
                            mode="text"
                            dark={true}
                            style={{ flex: 0.3, marginTop: 4, alignSelf: 'center' }}
                            labelStyle={{ fontSize: 11 }}
                            onPress={async () => {
                                try {
                                    if (lockComment || myComment === '') return;
                                    setLockComment(true);
                                    let poem = { ...props.item };
                                    let comm: Comment = {
                                        commentor: { docid: props.user.docid, username: props.user.username, uid: props.user.uid },
                                        message: myComment,
                                        date: new Date().getTime(),
                                    };
                                    poem.comments.push(comm);

                                    /**
                                     * Redux Operations
                                     */

                                    props.updatePoem(poem);
                                    if (poem.author.username === props.user.username) {
                                        props.updateUserPoem(poem);
                                    }

                                    /**
                                     * Firebase Operations
                                     */

                                    let req = await firestore().collection(usersCollectionId).doc(props.item.author.docid).get();
                                    let userData = req.data() as User;
                                    let index = userData.poems.findIndex(
                                        (val) => val.poemId === props.item.poemId && val.author.username === props.item.author.username
                                    );
                                    if (index === -1) throw 'FIREBASE: An error occurred!';
                                    userData.poems[index].comments = poem.comments;
                                    await firestore()
                                        .collection(usersCollectionId)
                                        .doc(props.item.author.docid)
                                        .update({ poems: userData.poems });

                                    let req2 = await firestore()
                                        .collection(poemsCollectionId)
                                        .where('date', '==', props.item.date)
                                        .where('title', '==', props.item.title)
                                        .where('poemId', '==', props.item.poemId)
                                        .get();
                                    await firestore()
                                        .collection(poemsCollectionId)
                                        .doc(req2.docs[0].id)
                                        .update({ comments: poem.comments });

                                    setLockComment(false);
                                    setMyComment('');
                                } catch (e) {
                                    setLockComment(false);
                                    Toast.show("We're sorry but an error occurred :(");
                                    console.log(e);
                                }
                            }}
                        >
                            Post
                        </Button>
                    </View>
                    {props.item.comments.length > 0 ? <Divider style={styles.divider} /> : <View />}
                    <FlatList
                        data={props.item.comments.sort((a, b) => b.date - a.date)}
                        keyExtractor={(_i, index) => index.toString()}
                        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
                        renderItem={({ item }) => (
                            <View style={styles.commentContainer}>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <TouchableOpacity
                                        style={{ marginRight: 12 }}
                                        onPress={() => props.navigation.navigate('UserDetail', { profileUser: item.commentor })}
                                    >
                                        <Avatar.Text
                                            style={styles.icon}
                                            size={36}
                                            label={item.commentor.username.slice(0, 2).toUpperCase()}
                                        />
                                    </TouchableOpacity>
                                    <Text style={styles.commentContainerText}>
                                        <Text style={styles.commentAuthor}>{item.commentor.username} </Text>
                                        <Text style={styles.commentText}>{item.message}</Text>
                                    </Text>
                                    {props.user.username === props.item.author.username ? (
                                        <View>
                                            <IconButton
                                                icon="delete"
                                                style={{ flex: 0.1 }}
                                                //@ts-ignore
                                                onPress={async () => {
                                                    try {
                                                        if (deleting) return;
                                                        setDeleting(true);
                                                        let commentToDelete = { ...item };
                                                        let poem = { ...props.item };
                                                        let myindex = poem.comments.findIndex(
                                                            (val) =>
                                                                val.commentor.username === commentToDelete!.commentor.username &&
                                                                val.date === commentToDelete!.date
                                                        );
                                                        if (myindex === -1) throw 'An error occurred';
                                                        poem.comments.splice(myindex, 1);

                                                        /**
                                                         * Redux Operations
                                                         */

                                                        props.updatePoem(poem);
                                                        if (poem.author.username === props.user.username) {
                                                            props.updateUserPoem(poem);
                                                        }

                                                        /**
                                                         * Firebase Operations
                                                         */

                                                        let req = await firestore()
                                                            .collection(usersCollectionId)
                                                            .doc(props.item.author.docid)
                                                            .get();
                                                        let userData = req.data() as User;

                                                        let index = userData.poems.findIndex(
                                                            (val) =>
                                                                val.poemId === props.item.poemId &&
                                                                val.author.username === props.item.author.username
                                                        );
                                                        if (index === -1) throw 'FIREBASE: An error occurred!';
                                                        userData.poems[index].comments = poem.comments;
                                                        await firestore()
                                                            .collection(usersCollectionId)
                                                            .doc(props.item.author.docid)
                                                            .update({ poems: userData.poems });

                                                        let req2 = await firestore()
                                                            .collection(poemsCollectionId)
                                                            .where('date', '==', props.item.date)
                                                            .where('title', '==', props.item.title)
                                                            .where('poemId', '==', props.item.poemId)
                                                            .get();
                                                        await firestore()
                                                            .collection(poemsCollectionId)
                                                            .doc(req2.docs[0].id)
                                                            .update({ comments: poem.comments });
                                                        setDeleting(false);
                                                    } catch (e) {
                                                        setDeleting(false);
                                                        Toast.show("We're sorry but an error occurred :(");
                                                        console.log(e);
                                                    }
                                                }}
                                            />
                                        </View>
                                    ) : (
                                        <View />
                                    )}
                                </View>
                            </View>
                        )}
                    />
                </View>
            ) : (
                <View />
            )}
        </Card>
    );
}

export default connector(PoemCard);

const styles = StyleSheet.create({
    cardContainer: {
        marginHorizontal: 6,
        marginVertical: 4,
    },
    titleContainer: {
        flexDirection: 'row',
        flex: 1,
        flexWrap: 'wrap',
        paddingHorizontal: 12,
    },
    cardTitle: {
        textAlign: 'center',
        paddingVertical: 12,
        fontSize: 22,
    },
    icon: {
        marginRight: 0,
    },
    menu: {
        position: 'absolute',
        right: 12,
    },
    commentContainer: {
        paddingHorizontal: 6,
        paddingTop: 7,
        paddingBottom: 3,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    commentContainerText: {
        flexWrap: 'wrap',
        flex: 1,
    },
    commentText: {
        fontSize: 14,
    },
    commentAuthor: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    commentInput: {
        flex: 1,
        flexDirection: 'row',
        paddingBottom: 6,
    },
    bodyText: {
        fontSize: 15,
        marginBottom: 12,
    },
    topics: {
        color: '#888',
        fontSize: 13,
    },
    actions: {
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 0,
        paddingHorizontal: 8,
    },
    author: {
        marginLeft: 8,
        fontSize: 15,
        color: '#111',
    },
    time: {
        fontSize: 14,
        color: '#666',
    },
    divider: {
        height: 1,
        marginTop: 8,
    },
    likeText: {
        fontSize: 18,
    },
});
