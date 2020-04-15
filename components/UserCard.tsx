import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Avatar, Text, Divider, Title, IconButton, Button } from 'react-native-paper';
import millify from 'millify';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../AppNav';
import { User } from '../interfaces/User';
import { connect, ConnectedProps } from 'react-redux';
import { setUser } from '../redux/actions/User';
import { RootState } from '../redux/store';
import firestore from '@react-native-firebase/firestore';
import { usersCollectionId } from '../constants/collection';

type UserCardDetailNavigationProp = StackNavigationProp<ProfileStackParamList, 'Profile'>;

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
    theUserProp: User;
    navigation: UserCardDetailNavigationProp;
    useForBlocking?: boolean;
};

function UserCard(props: Props) {
    const [lock, setLock] = useState(false);

    let follows = () => {
        let following = [...props.user.following];
        for (let i in following) {
            if (following[i].username === props.theUserProp.username) {
                return true;
            }
        }
        return false;
    };

    return (
        <Card style={styles.cardContainer}>
            <Card.Content style={styles.cardTitleContainer}>
                <Avatar.Text style={styles.icon} size={40} label={props.theUserProp.username.slice(0, 2).toUpperCase()} />
                <Title style={styles.cardTitle}>{props.theUserProp.username}</Title>
                {props.theUserProp.username === props.user.username ? (
                    <IconButton
                        style={{ marginLeft: 'auto' }}
                        icon="settings"
                        onPress={() => {
                            props.navigation.navigate('Settings');
                        }}
                    />
                ) : (
                    <View />
                )}
            </Card.Content>
            <Divider style={styles.divider} />
            <Card.Content
                style={
                    props.theUserProp.username === props.user.username
                        ? styles.cardContentContainer
                        : { ...styles.cardContentContainer, justifyContent: 'center' }
                }
            >
                <Text style={styles.textContainer}>
                    <Text style={styles.userInfoText}>
                        {millify(
                            props.theUserProp.username !== props.user.username ? props.theUserProp.totalPoems : props.user.totalPoems,
                            { lowerCase: true }
                        )}
                        {'\n'}
                    </Text>
                    Poems
                </Text>
                {props.theUserProp.username === props.user.username ? (
                    <Text style={styles.textContainer} onPress={() => props.navigation.navigate('FollowList', { type: 'Followers' })}>
                        <Text style={styles.userInfoText}>
                            {millify(props.theUserProp.followers.length, { lowerCase: true })}
                            {'\n'}
                        </Text>
                        Followers
                    </Text>
                ) : (
                    <View />
                )}
                {props.theUserProp.username === props.user.username ? (
                    <Text style={styles.textContainer} onPress={() => props.navigation.navigate('FollowList', { type: 'Following' })}>
                        <Text style={styles.userInfoText}>
                            {millify(props.theUserProp.following.length, { lowerCase: true })}
                            {'\n'}
                        </Text>
                        Following
                    </Text>
                ) : (
                    <View />
                )}
            </Card.Content>
            {props.theUserProp.username !== props.user.username ? <Divider style={styles.divider} /> : <View />}
            {props.theUserProp.username !== props.user.username ? (
                <Card.Content>
                    {props.useForBlocking ? (
                        <View>
                            <Button
                                mode="contained"
                                dark={true}
                                style={styles.followButton}
                                onPress={async () => {
                                    try {
                                        let myuser = { ...props.user };
                                        let blocked = myuser.blockedUsers.filter(
                                            (i) => i.username !== props.theUserProp.username && i.docid !== props.theUserProp.docid
                                        );
                                        myuser.blockedUsers = blocked;
                                        props.setUser(myuser);
                                        await firestore()
                                            .collection(usersCollectionId)
                                            .doc(props.user.docid)
                                            .update({ blockedUsers: myuser.blockedUsers });
                                        props.navigation.pop();
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }}
                            >
                                Unblock
                            </Button>
                        </View>
                    ) : (
                        <View>
                            {follows() ? (
                                <Button
                                    mode="contained"
                                    dark={true}
                                    style={styles.followButton}
                                    onPress={async () => {
                                        try {
                                            if (lock) return;
                                            setLock(true);
                                            let usr = { ...props.user };
                                            let myfollowing = usr.following.filter((val) => {
                                                return val.username !== props.theUserProp.username && val.docid !== props.theUserProp.docid;
                                            });
                                            usr.following = myfollowing;
                                            /**
                                             * Redux Operations
                                             */

                                            props.setUser(usr);

                                            /**
                                             * Firebase Operations
                                             */

                                            //Update user
                                            await firestore()
                                                .collection(usersCollectionId)
                                                .doc(props.user.docid)
                                                .update({ following: usr.following });

                                            //Get followed user
                                            let res = await firestore().collection(usersCollectionId).doc(props.theUserProp.docid).get();
                                            let followedusr = res.data()!;

                                            let resfollowers = followedusr.followers.filter(
                                                (val: User) => val.username !== props.user.username && val.docid !== props.user.docid
                                            );
                                            followedusr.followers = resfollowers;

                                            //Unfollow
                                            await firestore()
                                                .collection(usersCollectionId)
                                                .doc(props.theUserProp.docid)
                                                .update({ followers: followedusr.followers });
                                            setLock(false);
                                        } catch (e) {
                                            setLock(false);
                                            console.log(e);
                                        }
                                    }}
                                >
                                    Following
                                </Button>
                            ) : (
                                <Button
                                    mode="contained"
                                    style={styles.followButton}
                                    dark={true}
                                    onPress={async () => {
                                        try {
                                            setLock(true);
                                            let usr = { ...props.user };
                                            usr.following.push({
                                                docid: props.theUserProp.docid,
                                                username: props.theUserProp.username,
                                                uid: props.theUserProp.uid,
                                            });

                                            /**
                                             * Redux Operations
                                             */

                                            props.setUser(usr);

                                            /**
                                             * Firebase Operations
                                             */

                                            //Update user
                                            await firestore()
                                                .collection(usersCollectionId)
                                                .doc(props.user.docid)
                                                .update({ following: usr.following });

                                            //Get user desired to follow
                                            let res = await firestore().collection(usersCollectionId).doc(props.theUserProp.docid).get();
                                            let followedusr = res.data()!;
                                            followedusr.followers.push({ docid: props.user.docid, username: props.user.username });

                                            //Add user to the followed user followers
                                            await firestore()
                                                .collection(usersCollectionId)
                                                .doc(props.theUserProp.docid)
                                                .update({ followers: followedusr.followers });
                                            setLock(false);
                                        } catch (e) {
                                            setLock(false);
                                            console.log(e);
                                        }
                                    }}
                                >
                                    Follow
                                </Button>
                            )}
                        </View>
                    )}
                </Card.Content>
            ) : (
                <View />
            )}
        </Card>
    );
}

UserCard.defaultProps = {
    useForBlocking: false,
};

export default connector(UserCard);

const styles = StyleSheet.create({
    cardContainer: {
        marginHorizontal: 8,
        marginVertical: 4,
    },
    cardTitle: {
        textAlign: 'center',
        fontSize: 24,
    },
    cardTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 16,
    },
    icon: {
        marginRight: 16,
    },
    trashIcon: {
        alignSelf: 'flex-end',
    },
    cardContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 12,
    },
    textContainer: {
        textAlign: 'center',
    },
    divider: {
        height: 1,
        marginBottom: 8,
    },
    followButton: {
        marginVertical: 4,
    },
    userInfoText: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18,
    },
});
