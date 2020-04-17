import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../AppNav';
import { Card, Title, Divider } from 'react-native-paper';

type ProfileDetailNavigationProp = StackNavigationProp<ProfileStackParamList, 'Settings'>;

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems,
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    navigation: ProfileDetailNavigationProp;
};

function Settings(props: Props) {
    let settings: Array<{ label: string; route: 'ChangeLang' | 'ChangeTopics' | 'BlockList' | 'TOS' }> = [
        { label: 'Change Languages', route: 'ChangeLang' },
        { label: 'Change Topics', route: 'ChangeTopics' },
        { label: 'View Block List', route: 'BlockList' },
        { label: 'Terms Of Service', route: 'TOS' },
    ];
    return (
        <View>
            <FlatList
                keyExtractor={(_i, index) => index.toString()}
                data={settings}
                ItemSeparatorComponent={() => <Divider style={styles.divider} />}
                renderItem={({ item }) => (
                    <Card style={styles.cardContainer}>
                        <Title style={styles.cardTitle} onPress={() => props.navigation.navigate(item.route)}>
                            {item.label}
                        </Title>
                    </Card>
                )}
            />
        </View>
    );
}

export default connector(Settings);

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#ddd',
        marginHorizontal: 8,
        marginVertical: 12,
    },
    cardTitle: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        fontSize: 20,
    },
    divider: {
        height: 1,
    },
});
