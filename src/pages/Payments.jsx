import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import QRCode from "qrcode";
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import "./Payments.css";

function Payments() {
    const [searchParams] = useSearchParams();
    const refId = searchParams.get("ref"); // get reference ID from URL
    const [qrUrl, setQrUrl] = useState("");
    const [utr, setUtr] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [amount, setAmount] = useState(0);
    const [delegateName, setDelegateName] = useState("");

    // Generate QR code when refId is available
    useEffect(() => {
        if (!refId) return;

        const fetchDetailsAndGenerateQR = async () => {
            try {
                const q = query(collection(db, "registrations"), where("refId", "==", refId));
                const snapshot = await getDocs(q);

                if (snapshot.empty) {
                    console.error("No delegate found with this Ref ID");
                    return;
                }

                const data = snapshot.docs[0].data();
                setDelegateName(data.name);

                let calculatedAmount = 0;
                const { registrationType, yearOfStudy } = data;

                // Pricing Logic
                if (registrationType === "School Solo Delegation") {
                    calculatedAmount = 750;
                } else if (registrationType === "Internal Solo Delegation") {
                    if (yearOfStudy === "1st Year") {
                        calculatedAmount = 899;
                    } else {
                        // 2nd, 3rd, 4th Year
                        calculatedAmount = 999;
                    }
                } else if (registrationType === "External Solo Delegation") {
                    if (yearOfStudy === "1st Year") {
                        calculatedAmount = 999;
                    } else {
                        // 2nd, 3rd, 4th Year
                        calculatedAmount = 1099;
                    }
                } else {
                    // Fallback or default
                    calculatedAmount = 1000;
                }

                setAmount(calculatedAmount);

                // Generate QR Code with dynamic amount
                const upiLink = `upi://pay?pa=7995466261-2@axl&pn=Karthik Tatineni&am=${calculatedAmount}&tn=Reg Fee ${refId}&tr=${refId}`;

                QRCode.toDataURL(upiLink)
                    .then((url) => setQrUrl(url))
                    .catch((err) => console.error("QR Code generation failed", err));

                // Update the document with the calculated amount (optional but good for records)
                const docRef = doc(db, "registrations", snapshot.docs[0].id);
                await updateDoc(docRef, { amountToPay: calculatedAmount });

            } catch (error) {
                console.error("Error fetching details:", error);
            }
        };

        fetchDetailsAndGenerateQR();
    }, [refId]);

    const sendToGoogleSheets = async (delegateData) => {
        const scriptUrl = import.meta.env.VITE_SHEETS_API_URL;
        if (!scriptUrl) {
            console.warn("Google Sheets API URL not found in .env. Skipping secondary database sync.");
            return;
        }

        try {
            // Flatten preferences for easier spreadsheet viewing
            const flattenedData = {
                timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
                name: delegateData.name,
                email: delegateData.email,
                phone: delegateData.phone,
                college: delegateData.college,
                registrationType: delegateData.registrationType,
                yearOfStudy: delegateData.yearOfStudy,
                refId: delegateData.refId,
                amount: amount,
                utr: utr.trim(),
                pref1_committee: delegateData.preferences?.[0]?.committee || "-",
                pref1_countries: delegateData.preferences?.[0]?.countries?.join(", ") || "-",
                pref2_committee: delegateData.preferences?.[1]?.committee || "-",
                pref2_countries: delegateData.preferences?.[1]?.countries?.join(", ") || "-",
                pref3_committee: delegateData.preferences?.[2]?.committee || "-",
                pref3_countries: delegateData.preferences?.[2]?.countries?.join(", ") || "-",
            };

            await fetch(scriptUrl, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: [flattenedData]
                }),
            });
            console.log("Secondary database sync successful (Google Sheets)");
        } catch (error) {
            console.error("Secondary database sync failed:", error);
        }
    };

    const submitPayment = async () => {
        if (!utr.trim()) {
            alert("Please enter your UPI Transaction ID (UTR)");
            return;
        }

        if (!/^\d{12}$/.test(utr.trim())) {
            alert("Please enter a valid 12-digit UTR number.");
            return;
        }

        setLoading(true);

        try {
            // Find the delegate in Firestore by refId
            const q = query(
                collection(db, "registrations"),
                where("refId", "==", refId)
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                alert("Delegate not found!");
                setLoading(false);
                return;
            }

            const delegateDoc = snapshot.docs[0];
            const delegateData = delegateDoc.data();
            const delegateRef = doc(db, "registrations", delegateDoc.id);

            // Update delegate with UTR and payment timestamp
            await updateDoc(delegateRef, {
                utr: utr.trim(),
                paidAt: serverTimestamp(),
            });

            // Sync with Google Sheets (Secondary Database)
            await sendToGoogleSheets(delegateData);

            setSuccess(true);
            alert("✅ Payment recorded successfully!");
        } catch (error) {
            console.error("Payment update failed:", error);
            alert("❌ Failed to record payment. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="payment-page">
            <div className="payment-box">
                <h2>MUN IARE – Registration Fee</h2>
                <p className="info">
                    Welcome, <b>{delegateName}</b><br />
                    Scan the QR code and complete the payment.<br />
                    After payment, enter your UPI Transaction ID (UTR).
                </p>

                <div id="qr">
                    {qrUrl ? (
                        <img src={qrUrl} alt="Payment QR Code" />
                    ) : (
                        <p>Loading Payment Details...</p>
                    )}
                </div>

                <p className="info">
                    Amount: <b>₹{amount}</b><br />
                    Reference: <b>{refId || "N/A"}</b>
                </p>

                {!success ? (
                    <>
                        <input
                            type="text"
                            placeholder="Enter UPI Transaction ID (UTR)"
                            value={utr}
                            onChange={(e) => setUtr(e.target.value)}
                            className="utr-input"
                        />
                        <button className="btn-payment" onClick={submitPayment} disabled={loading || !refId || amount === 0}>
                            {loading ? "Submitting..." : "Submit Payment"}
                        </button>
                    </>
                ) : (
                    <div id="paymentReceipt">
                        <h3>Payment Receipt</h3>
                        <p><b>Reference ID:</b> {refId}</p>
                        <p><b>Amount Paid:</b> ₹{amount}</p>
                        <p><b>UTR:</b> {utr}</p>
                        <p><b>Date:</b> {new Date().toLocaleString()}</p>
                    </div>
                )}

                <p className="note">
                    Your registration confirmation mail will be sent after payment verification.
                </p>
            </div>
        </div>
    );
}

export default Payments;
