import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: string;
  bookTitle: string;
  onSuccess: () => void;
}

type PaymentMethod = "upi" | "card";

const PaymentDialog = ({ open, onOpenChange, amount, bookTitle, onSuccess }: PaymentDialogProps) => {
  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (method === "upi") {
      if (!upiId.match(/^[\w.-]+@[\w]+$/)) e.upi = "Enter a valid UPI ID (e.g. name@upi)";
    } else {
      if (!cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) e.card = "Enter a valid 16-digit card number";
      if (!expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = "Use MM/YY format";
      if (!cvc.match(/^\d{3,4}$/)) e.cvc = "Enter 3 or 4 digit CVV";
      if (!cardName.trim()) e.name = "Enter cardholder name";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handlePay = () => {
    if (!validate()) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const methodLabel = method === "upi" ? "UPI" : "Card";
      toast({ title: "Payment Successful", description: `${amount} paid for "${bookTitle}" via ${methodLabel}.` });
      onSuccess();
      onOpenChange(false);
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setUpiId(""); setCardNumber(""); setExpiry(""); setCvc(""); setCardName("");
    setErrors({});
  };

  const paymentMethods = [
    { value: "upi" as const, label: "UPI", icon: QrCode },
    { value: "card" as const, label: "Credit/Debit/ATM", icon: CreditCard },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <CreditCard className="h-5 w-5 text-accent" />
            Pay Fine
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Fine for</p>
                <p className="font-medium text-foreground">{bookTitle}</p>
              </div>
              <p className="text-xl font-display font-bold text-foreground">{amount}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Payment Method</Label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setMethod(value); setErrors({}); }}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-all text-left ${
                    method === value
                      ? "border-accent bg-accent/10 text-accent-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-accent/40"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {method === "upi" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>UPI ID</Label>
                <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" />
                {errors.upi && <p className="text-sm text-destructive">{errors.upi}</p>}
              </div>
              <p className="text-xs text-muted-foreground">You'll receive a payment request on your UPI app</p>
            </div>
          )}

          {method === "card" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Cardholder Name</Label>
                <Input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on card" />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label>Card Number</Label>
                <Input value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} placeholder="4242 4242 4242 4242" maxLength={19} />
                {errors.card && <p className="text-sm text-destructive">{errors.card}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expiry</Label>
                  <Input value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" maxLength={5} />
                  {errors.expiry && <p className="text-sm text-destructive">{errors.expiry}</p>}
                </div>
                <div className="space-y-2">
                  <Label>CVV</Label>
                  <Input value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" maxLength={4} type="password" />
                  {errors.cvc && <p className="text-sm text-destructive">{errors.cvc}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>All payments are processed securely</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handlePay} disabled={processing} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {processing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              `Pay ${amount}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
