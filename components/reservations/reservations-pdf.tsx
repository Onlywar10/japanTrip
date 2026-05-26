import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";

// Self-hosted Traditional-Chinese face — covers Latin, 繁體中文 and the 〒 postal mark,
// so the PDF can match whichever language the app is currently set to.
Font.register({
  family: "Noto Sans TC",
  src: "/fonts/NotoSansTC-Regular.otf",
});

// Don't hyphenate — keep romaji addresses and confirmation numbers readable.
Font.registerHyphenationCallback((word) => [word]);

const COLOR = {
  ink: "#19202f",
  inkSoft: "#4d5263",
  inkFaint: "#6d6755",
  gold: "#b08534",
  line: "#d8cdb7",
  card: "#faf6ec",
} as const;

export interface PdfReservation {
  type: string;
  status: string;
  statusColor: string;
  title: string;
  dateLabel: string;
  confirmationNumbers?: string[];
  phone?: string;
  address?: string;
}

export interface ReservationsPdfProps {
  heading: string;
  brand: string;
  dates: string;
  generatedText: string;
  labels: {
    confirmation: string;
    phone: string;
    address: string;
  };
  reservations: PdfReservation[];
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Noto Sans TC",
    color: COLOR.ink,
    fontSize: 10,
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 22,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.line,
  },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLOR.gold,
    marginBottom: 7,
  },
  heading: { fontSize: 22 },
  generated: { fontSize: 8, color: COLOR.inkFaint, marginTop: 9 },
  card: {
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLOR.line,
    borderLeftWidth: 3,
    borderLeftColor: COLOR.gold,
    borderRadius: 6,
    backgroundColor: COLOR.card,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  cardType: {
    fontSize: 7.5,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.inkFaint,
  },
  cardStatus: {
    fontSize: 7,
    letterSpacing: 1,
    textTransform: "uppercase",
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 9,
    borderWidth: 1,
  },
  cardTitle: { fontSize: 13, marginBottom: 2 },
  cardDate: { fontSize: 9, color: COLOR.inkSoft, marginBottom: 9 },
  field: { flexDirection: "row", marginBottom: 5 },
  fieldLabel: {
    width: 96,
    fontSize: 7.5,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: COLOR.inkFaint,
    paddingTop: 1.5,
  },
  fieldValue: { flex: 1, fontSize: 10, lineHeight: 1.4 },
  pageNumber: {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    textAlign: "center",
    fontSize: 8,
    color: COLOR.inkFaint,
  },
});

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

export function ReservationsPdf({
  heading,
  brand,
  dates,
  generatedText,
  labels,
  reservations,
}: ReservationsPdfProps) {
  return (
    <Document title={heading} author={brand}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            {brand} · {dates}
          </Text>
          <Text style={styles.heading}>{heading}</Text>
          <Text style={styles.generated}>{generatedText}</Text>
        </View>

        {reservations.map((r, i) => (
          <View key={i} style={styles.card} wrap={false}>
            <View style={styles.cardTop}>
              <Text style={styles.cardType}>{r.type}</Text>
              <Text
                style={[
                  styles.cardStatus,
                  { color: r.statusColor, borderColor: r.statusColor },
                ]}
              >
                {r.status}
              </Text>
            </View>

            <Text style={styles.cardTitle}>{r.title}</Text>
            <Text style={styles.cardDate}>{r.dateLabel}</Text>

            {r.confirmationNumbers && r.confirmationNumbers.length > 0 ? (
              <Field
                label={labels.confirmation}
                value={r.confirmationNumbers.join("\n")}
              />
            ) : null}
            {r.phone ? <Field label={labels.phone} value={r.phone} /> : null}
            {r.address ? (
              <Field label={labels.address} value={r.address} />
            ) : null}
          </View>
        ))}

        <Text
          style={styles.pageNumber}
          fixed
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}

/** Render the reservations document to a PDF blob (client-side). */
export async function renderReservationsPdf(
  props: ReservationsPdfProps
): Promise<Blob> {
  return pdf(<ReservationsPdf {...props} />).toBlob();
}
