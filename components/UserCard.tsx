import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Avatar, Text, Divider, Title, IconButton } from 'react-native-paper';
import millify from 'millify';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../AppNav';
import { User, SubUser } from '../interfaces/User';
import { connect, ConnectedProps } from 'react-redux';
import { setUser } from '../redux/actions/User';
import { RootState } from '../redux/store';
import firestore from '@react-native-firebase/firestore';


type UserCardDetailNavigationProp = StackNavigationProp<
    ProfileStackParamList,
    'Profile'
>;

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems
});

const mapDispatch = {
    setUser
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    theUserProp: User;
    navigation: UserCardDetailNavigationProp;
};


function UserCard(props: Props) {
    
    return (
        <Card style={styles.cardContainer}>
            <Card.Content style={styles.cardTitleContainer}>
                <Avatar.Text style={styles.icon} size={40} label={props.theUserProp.username.slice(0, 2).toUpperCase()} />
                <Title style={styles.cardTitle}>{props.theUserProp.username}</Title>
                {
                    props.theUserProp.username === props.user.username ?
                        < IconButton style={{ marginLeft: 'auto' }} icon="settings"
                            onPress={() => {
                                props.navigation.navigate('Settings');
                            }}
                        />
                        :
                        <View />
                }
            </Card.Content>
            <Divider style={styles.divider} />
            <Card.Content style={styles.cardContentContainer}>
                <Text style={styles.textContainer}>
                    <Text style={styles.userInfoText}>
                        {millify(props.theUserProp.poems.length, { lowerCase: true })}
                        {'\n'}
                    </Text>
                    Poems
                </Text>
                <Text style={styles.textContainer}>
                    <Text style={styles.userInfoText}>
                        {millify(props.theUserProp.followers.length, { lowerCase: true })}
                        {'\n'}
                    </Text>
                    Followers
                </Text>
                <Text style={styles.textContainer}>
                    <Text style={styles.userInfoText}>
                        {millify(props.theUserProp.following.length, { lowerCase: true })}
                        {'\n'}
                    </Text>
                    Following
                </Text>
            </Card.Content>
        </Card>
    );
}

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
        paddingBottom: 12,
    },
    icon: {
        marginRight: 16,
    },
    trashIcon: {
        alignSelf: 'flex-end'
    },
    cardContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textContainer: {
        textAlign: 'center',
    },
    divider: {
        height: 1,
        marginBottom: 8,
    },
    userInfoText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
});
