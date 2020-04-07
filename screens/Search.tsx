import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Searchbar, Card, Avatar, Divider, ActivityIndicator } from 'react-native-paper';
import { Poem } from '../interfaces/Poem';
import { SubUser, User } from '../interfaces/User';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList } from '../AppNav';
import firestore from '@react-native-firebase/firestore';
import { usersCollectionId, poemsCollectionId } from '../constants/collection';
import PoemCard from '../components/PoemCard';

type PoemDetailNavigationProp = StackNavigationProp<SearchStackParamList, 'Search'>;

type Props = {
    navigation: PoemDetailNavigationProp;
};

const Search = (props: Props) => {
    let [searchText, setSeachText] = useState('');
    let [poems, setPoems] = useState<Array<Poem>>([]);
    let [users, setUsers] = useState<Array<SubUser>>([]);
    let [loading, setLoading] = useState(false);

    return (
        <View>
            <Searchbar
                style={{ marginHorizontal: 6, marginVertical: 12 }}
                value={searchText}
                autoCapitalize="none"
                returnKeyType="done"
                onChangeText={async (val) => {
                    //Clicked the clear button
                    if (searchText !== '' && val === '') {
                        setPoems([]);
                        setUsers([]);
                        setLoading(false);
                    }
                    setSeachText(val);
                    let resPoem = await firestore().collection(poemsCollectionId).where('title', '==', val).get();
                    let resUser = await firestore().collection(usersCollectionId).where('username', '==', val).get();
                    setPoems(resPoem.docs.map((i) => i.data() as Poem));
                    setUsers(resUser.docs.map((i) => i.data() as User));
                    setLoading(false);
                }}
                placeholder="Search"
            />
            {loading ? (
                <ActivityIndicator style={{ marginTop: 50 }} size={50} />
            ) : (
                <View>
                    {users.length < 1 && poems.length < 1 && searchText != '' ? (
                        <Card style={styles.cardContainer}>
                            <Card.Content>
                                <Text style={styles.text}>Nothing was found...</Text>
                            </Card.Content>
                        </Card>
                    ) : (
                        <View />
                    )}
                </View>
            )}
            {users.length > 0 ? (
                <Card style={styles.cardContainer}>
                    <Card.Content>
                        <Text style={styles.text}>People</Text>
                    </Card.Content>
                    <Card.Content>
                        <FlatList
                            data={users}
                            keyExtractor={(_i, index) => index.toString()}
                            ItemSeparatorComponent={() => <Divider style={styles.divider} />}
                            renderItem={({ item }) => (
                                <Card
                                    onPress={() =>
                                        props.navigation.push('UserDetail', { profileUser: { id: item.id, username: item.username } })
                                    }
                                >
                                    <Card.Content style={styles.contentContainer}>
                                        <Avatar.Text size={36} label={item.username.slice(0, 2)}></Avatar.Text>
                                        <Text style={styles.text}>{item.username}</Text>
                                    </Card.Content>
                                </Card>
                            )}
                        />
                    </Card.Content>
                </Card>
            ) : (
                <View />
            )}
            {poems.length > 0 ? (
                <View>
                    <Card style={styles.cardContainer}>
                        <Card.Content>
                            <Text style={styles.text}>Poems</Text>
                        </Card.Content>
                    </Card>
                    <FlatList
                        data={poems}
                        keyExtractor={(_i, index) => index.toString()}
                        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
                        renderItem={({ item }) => <PoemCard item={item} navigation={props.navigation} full={false} />}
                    />
                </View>
            ) : (
                <View />
            )}
        </View>
    );
};

export default Search;

const styles = StyleSheet.create({
    cardContainer: {
        marginHorizontal: 6,
        marginVertical: 6,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    poemTitle: {},
    poemAuthor: {
        fontSize: 15,
        color: '#111',
    },
    divider: {
        height: 1,
        marginBottom: 8,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 12,
    },
});