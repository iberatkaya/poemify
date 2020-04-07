import React from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet } from 'react-native';
import UserCard from '../components/UserCard';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../AppNav';
import { RouteProp } from '@react-navigation/native';
import { Card, Paragraph, Avatar } from 'react-native-paper';

type PoemDetailNavigationProp = StackNavigationProp<ProfileStackParamList, 'FollowList'>;

type FollowListRouteProp = RouteProp<ProfileStackParamList, 'FollowList'>;

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems,
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    navigation: PoemDetailNavigationProp;
    route: FollowListRouteProp;
};

function FollowList(props: Props) {
    let myitems = props.route.params!.type === 'follower' ? props.user.followers : props.user.following;
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                keyExtractor={(_i, index) => index.toString()}
                data={myitems.sort((a, b) => b.username.charCodeAt(0) - a.username.charCodeAt(0))}
                renderItem={({ item }) => (
                    <Card
                        style={styles.cardContainer}
                        onPress={() => props.navigation.push('UserDetail', { profileUser: { id: item.id, username: item.username } })}
                    >
                        <Card.Content style={styles.contentContainer}>
                            <Avatar.Text size={36} label={item.username.slice(0, 2)}></Avatar.Text>
                            <Text style={styles.text}>{item.username}</Text>
                        </Card.Content>
                    </Card>
                )}
            />
        </View>
    );
}

export default connector(FollowList);

const styles = StyleSheet.create({
    cardContainer: {
        marginHorizontal: 6,
        marginVertical: 6,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 12,
    },
});
