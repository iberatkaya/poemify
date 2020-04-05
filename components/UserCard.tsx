import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Avatar, Text, Divider, Title } from 'react-native-paper';
import millify from 'millify';
import { User } from '../interfaces/User';

type Props = {
    user: User;
};

function UserCard(props: Props) {
    return (
        <Card style={styles.cardContainer}>
            <Card.Content style={styles.cardTitleContainer}>
                <Avatar.Text style={styles.icon} size={40} label={props.user.username.slice(0, 2).toUpperCase()} />
                <Title style={styles.cardTitle}>{props.user.username}</Title>
            </Card.Content>
            <Divider style={styles.divider} />
            <Card.Content style={styles.cardContentContainer}>
                <Text style={styles.textContainer}>
                    <Text style={styles.userInfoText}>
                        {millify(props.user.poems.length, { lowerCase: true })}
                        {'\n'}
                    </Text>
                    Poems
                </Text>
                <Text style={styles.textContainer}>
                    <Text style={styles.userInfoText}>
                        {millify(props.user.followers.length, { lowerCase: true })}
                        {'\n'}
                    </Text>
                    Followers
                </Text>
                <Text style={styles.textContainer}>
                    <Text style={styles.userInfoText}>
                        {millify(props.user.following.length, { lowerCase: true })}
                        {'\n'}
                    </Text>
                    Following
                </Text>
            </Card.Content>
        </Card>
    );
}

export default UserCard;

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
