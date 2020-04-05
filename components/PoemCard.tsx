import React, { useEffect, useState } from 'react';
import { Card, Paragraph, Text, IconButton, Divider } from 'react-native-paper';
import { Poem } from '../interfaces/Poem';
import { connect, ConnectedProps } from 'react-redux';
import { User } from '../interfaces/User';
import { updatePoem } from '../redux/actions/Poem';
import { updateUserPoem } from '../redux/actions/User';
import { StyleSheet } from 'react-native';

interface RootState {
    user: User;
}

const mapState = (state: RootState) => ({
    user: state.user,
});

const mapDispatch = {
    updatePoem,
    updateUserPoem
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    item: Poem;
};

function PoemCard(props: Props) {
    let [liked, setLiked] = useState<boolean>(false);

    useEffect(() => {
        for (let i in props.item.likes) {
            if (props.item.likes[i].username === props.user.username) {
                setLiked(true);
                return;
            }
        }
    });

    return (
        <Card style={styles.cardContainer}>
            <Card.Title titleStyle={styles.cardTitle} title={props.item.title} subtitle={props.item.author.username} />
            <Card.Content>
                <Paragraph>{props.item.body}</Paragraph>
            </Card.Content>
            <Divider style={styles.divider} />
            <Card.Actions style={styles.actions}>
                {liked ? (
                    <IconButton
                        color="red"
                        icon="heart"
                        style={styles.icon}
                        size={20}
                        onPress={() => {
                            setLiked(false);
                            let poem = props.item;
                            let myindex = poem.likes.findIndex((val) => val.username === props.user.username);
                            poem.likes.splice(myindex);
                            props.updatePoem(poem);
                            if (poem.author.username === props.user.username) {
                                props.updateUserPoem(poem);
                            }
                        }}
                    />
                ) : (
                    <IconButton
                        icon="heart-outline"
                        style={styles.icon}
                        size={20}
                        onPress={() => {
                            setLiked(true);
                            let poem = props.item;
                            poem.likes.push(props.user);
                            props.updatePoem(poem);
                            if (poem.author.username === props.user.username) {
                                props.updateUserPoem(poem);
                            }
                        }}
                    />
                )}
                <Text style={styles.likeText}>{props.item.likes.length}</Text>
            </Card.Actions>
        </Card>
    );
}

export default connector(PoemCard);

const styles = StyleSheet.create({
    cardContainer: {
        marginHorizontal: 8,
        marginVertical: 4,
    },
    cardTitle: {
        textAlign: 'center',
        fontSize: 22,
    },
    icon: {
        marginRight: 0,
    },
    actions: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 1,
        paddingHorizontal: 12
    },
    divider: {
        height: 1,
        marginTop: 8,
    },
    likeText: {
        fontSize: 18,
    },
});
