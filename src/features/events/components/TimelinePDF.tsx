import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { type Event } from '../types'

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#FFFFFF' },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  eventContainer: {
    position: 'relative',
    paddingLeft: 20,
    borderLeft: '2pt solid #e2e8f0',
    marginBottom: 0,
  },
  card: {
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
    border: '1pt solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  dot: {
    position: 'absolute',
    left: -5,
    top: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    border: '1pt solid #0ea5e9',
  },
  dotActive: {
    backgroundColor: '#0ea5e9',
  },
  dotInactive: {
    backgroundColor: '#FFFFFF',
  },
  eventTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  meta: { fontSize: 9, color: '#64748b', flexDirection: 'row', gap: 10 },
  badge: {
    marginTop: 6,
    padding: '2 6',
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    borderRadius: 4,
    fontSize: 8,
    alignSelf: 'flex-start',
  },
})

export const TimelinePDF = ({
  events,
  title,
}: {
  events: Event[]
  title: string
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{title}</Text>
      <View>
        {events.map((event, i) => (
          <View key={i} style={styles.eventContainer}>
            <View
              style={[
                styles.dot,
                event.isDismissed ? styles.dotActive : styles.dotInactive,
              ]}
            />
            <View style={styles.card}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.meta}>
                <Text>{format(new Date(event.date), 'MMM d, yyyy')}</Text>
                <Text>•</Text>
                <Text>{event.addedByUserName}</Text>
              </View>
              {event.liabilityName && (
                <View style={styles.badge}>
                  <Text>{event.liabilityName}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
)
