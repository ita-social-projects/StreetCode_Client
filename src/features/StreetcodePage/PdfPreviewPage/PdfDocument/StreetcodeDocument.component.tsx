import {
    Document, Font, Image, Page, Rect, StyleSheet, Svg, Text, View,
} from '@react-pdf/renderer';
import { Style } from '@react-pdf/types';
import React from 'react';
import CloserTextBold from '@fonts/CloserText-Bold.woff';
import CloserTextBoldItalic from '@fonts/CloserText-BoldItalic.woff';
import CloserTextItalic from '@fonts/CloserText-Italic.woff';
import CloserText from '@fonts/CloserText-Medium.woff';
import Roboto from '@fonts/Roboto-Medium.woff';
import TagMap from '@constants/pdf-document-tag-map';
import useMobx from '@stores/root-store';

import monthsMap from '@constants/month-map';
import base64ToUrl from '@utils/base64ToUrl.utility';
import FromDateToString from '@utils/FromDateToString';
import StreetcodeImage from '@models/media/image.model';
import Streetcode from '@models/streetcode/streetcode-types.model';
import TimelineItem from '@models/timeline/chronology.model';

Font.register({ family: 'CloserText', fonts: [{ src: CloserText, fontWeight: 'normal' }] });
Font.register({ family: 'CloserText', fonts: [{ src: CloserTextBold, fontWeight: 'bold' }] });
Font.register({ family: 'CloserText', fonts: [{ src: CloserTextItalic, fontWeight: 'normal', fontStyle: 'italic' }] });
Font.register({ family: 'CloserText', fonts: [{ src: CloserTextBoldItalic, fontWeight: 'bold', fontStyle: 'italic' }] });

Font.register({ family: 'Roboto', fonts: [{ src: Roboto, fontWeight: 'normal' }] });

const styles = StyleSheet.create({
    page: {
        fontFamily: 'CloserText',
        flexDirection: 'column',
        paddingTop: 35,
        paddingBottom: 35,
        paddingRight: 35,
        paddingLeft: 35,
    },
    section: {
        flexDirection: 'row',
        gap: 15,
    },
    textBlock: {
        flexDirection: 'column',
    },
    teaser: {
        width: 325,
        marginTop: 14,
        fontSize: 12,
    },
    name: {
        fontSize: 20,
    },
    datestring: {
        fontSize: 14,
        marginTop: 8,
    },
    canvas: {
        height: 40,
        borderColor: '#E04031',
        border: 2,
    },
    blockTitle: {
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        fontSize: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    factCard: {
        gap: '10px',
        border: '2px solid #DCDBDB',
        borderBottomWidth: 4,
        borderRadius: 20,
        padding: '15px',
        transform: 'translateY(1px)',
    },
});

interface Props {
    streetcode: Streetcode;
    image: StreetcodeImage;
}

const StreetcodeDocument = ({ streetcode, image }: Props) => {
    const { timelineItemStore, textVideoStore, factsStore } = useMobx();
    const { getTimelineItemArray } = timelineItemStore;
    const source = base64ToUrl(image.base64, image.mimeType);
    const firstFact = factsStore.getFactArray[0];

    const getDateStrint = (timelineItem: TimelineItem) => {
        if (timelineItem.dateViewPattern === 1) {
            const words = FromDateToString(new Date(timelineItem.date), timelineItem.dateViewPattern).split(' ');
            return `${words[0]} ${monthsMap.get(words[1])}`;
        }
        return FromDateToString(new Date(timelineItem.date), timelineItem.dateViewPattern);
    };

    const recursiveBuild = (element: HTMLElement): React.ReactNode | string | null => {
        if (element.childNodes.length === 0) {
            if (element.nodeName === 'BR') {
                return null;
            }
            return element.textContent;
        }
        const tagStyles = TagMap.find((el) => el.tagName === element.nodeName)?.styles as Style;
        const children: React.ReactNode[] = [];
        element.childNodes.forEach((el) => {
            children.push(recursiveBuild(el as HTMLElement));
        });

        if (tagStyles !== undefined) {
            return (
                <Text style={{ ...tagStyles }}>{ children }</Text>
            );
        }
        return (
            <Text>{ children }</Text>
        );
    };

    const getFormatedText = (): React.ReactNode[] => {
        const elements: React.ReactNode[] = [];
        const parser = new DOMParser();
        if (!textVideoStore.Text) {
            return elements;
        }
        const doc = parser.parseFromString(textVideoStore.Text.textContent, 'text/html');
        const body = doc.querySelector('body');
        body?.childNodes.forEach((el) => {
            elements.push(recursiveBuild(el as HTMLElement));
        });
        return elements;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page} wrap>
                <View style={styles.section}>
                    <Image source={source} style={{ width: 180 }} />
                    <View style={styles.textBlock}>
                        <Text style={styles.name}>
                            {streetcode.title}
                        </Text>
                        <Text style={styles.datestring}>
                            {streetcode.dateString}
                        </Text>
                        <Text style={styles.teaser}>
                            {streetcode.teaser}
                        </Text>
                    </View>
                </View>
                {
                    getTimelineItemArray.length > 0 && (
                        <>
                            <View style={styles.blockTitle}>
                                <Svg style={{ width: 5, height: 5 }} viewBox="0 0 5 5">
                                    <Rect width="5" height="5" fill="#E04031" />
                                </Svg>
                                <Text>
                                Хронологія
                                </Text>
                                <Svg style={{ width: 5, height: 5 }} viewBox="0 0 5 5">
                                    <Rect width="5" height="5" fill="#E04031" />
                                </Svg>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                {getTimelineItemArray.map((item) => (
                                    <View style={{ flexDirection: 'row' }}>
                                        <View
                                            style={{
                                                width: 80,
                                                position: 'relative',
                                                paddingRight: 18,
                                                overflow: 'hidden',
                                            }}
                                            wrap={false}
                                        >
                                            <Text style={{
                                                position: 'absolute',
                                                top: '50%',
                                                transform: 'translateY(-12px)',
                                            }}
                                            >
                                                {new Date(item.date).getFullYear()}
                                            </Text>
                                            <Svg style={{ width: 5,
                                                          height: 190,
                                                          position: 'absolute',
                                                          top: 0,
                                                          left: 60 }} >
                                                <Rect width="5" height="190" fill="#891F16" />
                                            </Svg>
                                            <Svg style={{
                                                width: 15,
                                                height: 15,
                                                position: 'absolute',
                                                top: '50%',
                                                left: 55,
                                                transform: 'translateY(-7.5px)',
                                            }}
                                            >
                                                <Rect width="15" height="15" fill="#D9D9D9" />
                                            </Svg>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'column',
                                                gap: 9,
                                                width: 450,
                                                paddingBottom: 20,
                                            }}
                                            wrap={false}
                                        >
                                            <Text style={{ color: '#5D5D5D', fontSize: 14 }}>
                                                {getDateStrint(item)}
                                            </Text>
                                            <Text style={{ fontSize: 16, color: '#891F16' }}>{item.title}</Text>
                                            <Text style={{ fontFamily: 'Roboto', fontSize: 14, color: '#4D4D4D' }}>
                                                {item.description}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </>
                    )
                }
                {
                    textVideoStore.Text && (
                        <View>
                            <View wrap={false} style={styles.blockTitle}>
                                <Svg style={{ width: 5, height: 5 }} viewBox="0 0 5 5">
                                    <Rect width="5" height="5" fill="#E04031" />
                                </Svg>
                                <Text>
                                    { textVideoStore.Text?.title }
                                </Text>
                                <Svg style={{ width: 5, height: 5 }} viewBox="0 0 5 5">
                                    <Rect width="5" height="5" fill="#E04031" />
                                </Svg>
                            </View>
                            <View style={{ flexDirection: 'column', gap: 5 }}>
                                { getFormatedText() }
                            </View>
                        </View>
                    )
                }
                {
                    factsStore.getFactArray.length > 0 && (
                        <>
                            <View wrap={false} style={{ marginBottom: 20 }}>
                                <View style={styles.blockTitle}>
                                    <Svg style={{ width: 5, height: 5 }} viewBox="0 0 5 5">
                                        <Rect width="5" height="5" fill="#E04031" />
                                    </Svg>
                                    <Text>
                                    Wow-факти
                                    </Text>
                                    <Svg style={{ width: 5, height: 5 }} viewBox="0 0 5 5">
                                        <Rect width="5" height="5" fill="#E04031" />
                                    </Svg>
                                </View>
                                <View wrap={false} style={{ ...styles.factCard, flexDirection: 'row' }}>
                                    <View style={{
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        maxWidth: '50%',
                                        gap: 10,
                                    }}
                                    >
                                        <Image
                                            source={base64ToUrl(firstFact.image?.base64, firstFact.image?.mimeType)}
                                        />
                                        <Text style={{
                                            textAlign: 'center',
                                            color: '#DB3424',
                                            flexGrow: 1,
                                        }}
                                        >
                                            {firstFact.title}
                                        </Text>
                                    </View>
                                    <View style={{ maxWidth: '50%' }}>
                                        <Text style={{ fontSize: 12 }}>{firstFact.factContent}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                {factsStore.getFactArray.slice(1).map((fact, index) => (
                                    <View
                                        wrap={false}
                                        style={{
                                            ...styles.factCard,
                                            flexDirection: index % 2 === 0 ? 'row-reverse' : 'row',
                                        }}
                                    >
                                        <View style={{
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            maxWidth: '50%',
                                            gap: 10,
                                        }}
                                        >
                                            <Image
                                                source={base64ToUrl(fact.image?.base64, fact.image?.mimeType)}
                                            />
                                            <Text style={{
                                                textAlign: 'center',
                                                color: '#DB3424',
                                                flexGrow: 1,
                                            }}
                                            >
                                                {fact.title}
                                            </Text>
                                        </View>
                                        <View style={{ maxWidth: '50%' }}>
                                            <Text style={{ fontSize: 12 }}>{fact.factContent}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </>
                    )
                }
            </Page>
        </Document>
    );
};

export default StreetcodeDocument;
