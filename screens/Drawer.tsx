import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Linking, Platform, Image } from 'react-native';
import { IconButton, Divider } from 'react-native-paper';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { connect, ConnectedProps } from 'react-redux';
import { setUser } from '../redux/actions/User';
import { RootState } from '../redux/store';
import { User } from '../interfaces/User';
import { DrawerParamList } from 'AppNav';
import AsyncStorage from '@react-native-community/async-storage';

type EnteranceScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'Tabs'>;

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
    nav: EnteranceScreenNavigationProp;
};

function Drawer(props: Props) {
    return (
        <View style={{ height: '100%' }}>
            <View style={{ height: 150, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                <Image style={{ height: 100, width: 100 }} source={require('../assets/icon.png')} />
            </View>
            <Divider style={styles.divider} />
            <TouchableOpacity
                onPress={() => {
                    Linking.openURL('mailto:ibraberatkaya@gmail.com?subject=Poemify Support and Feedback');
                }}
                style={styles.itemRow}
            >
                <IconButton icon="email-outline" size={22} color="#777" />
                <Text style={styles.text}>Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.logout}
                onPress={async () => {
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
                }}
            >
                <IconButton icon="logout" size={22} color="#777" />
                <Text style={styles.text}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

export default connector(Drawer);

const styles = StyleSheet.create({
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 17,
        paddingVertical: 12,
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingLeft: 12,
        color: '#000',
    },
    logout: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 17,
        paddingVertical: 12,
        position: 'absolute',
        bottom: 0,
    },
    divider: {
        backgroundColor: '#ccc',
        height: 1,
    },
});
