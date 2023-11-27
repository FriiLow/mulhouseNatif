import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Linking } from 'react-native';
import axios, { AxiosResponse } from 'axios';

interface EventItem {
    uid: string;
    title_fr: string;
    description_fr: string;
    daterange_fr: string;
    image: string;
    canonicalurl: string;
}

const MulhouseAPI: React.FC = () => {
    const [data, setData] = useState<EventItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: AxiosResponse<any> = await axios.get(
                    'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records?limit=20&lang=fr&refine=location_city%3A%22Mulhouse%22'
                );
                setData(response.data.results);
            } catch (error) {
                console.error('Erreur lors de la requête API', error);
            }
        };

        fetchData();
    }, []);

    const renderItem = ({ item }: { item: EventItem }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title_fr}</Text>
                <Text style={styles.description}>{item.description_fr}</Text>
                <Text style={styles.daterange}>{item.daterange_fr}</Text>
                <Text style={styles.link} onPress={() => Linking.openURL(item.canonicalurl)}>
                    Voir plus
                </Text>
            </View>
        </View>
    );

    return (
        <View>
            <Text>test</Text>
            <FlatList
                data={data}
                keyExtractor={(item) => item.uid}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    image: {
        width: 80,
        height: 80,
        marginRight: 16,
        borderRadius: 8,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 16,
        marginBottom: 4,
    },
    daterange: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 4,
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});

export default MulhouseAPI;
