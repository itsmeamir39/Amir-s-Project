import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScanBarcode, Camera, X, Keyboard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const BarcodeScanner = ({ onScan, placeholder = "Scan or enter barcode...", value, onChange }: BarcodeScannerProps) => {
  const [showCamera, setShowCamera] = useState(false);
  const [manualInput, setManualInput] = useState(value || "");
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const inputValue = value !== undefined ? value : manualInput;

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setScanning(true);
      
      // Simulate barcode detection after 3 seconds for demo
      setTimeout(() => {
        const demoBarcode = `978-${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
        onScan(demoBarcode);
        toast({ title: "Barcode Scanned", description: `Detected: ${demoBarcode}` });
        setShowCamera(false);
        stopCamera();
      }, 3000);
    } catch {
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please use manual entry.",
        variant: "destructive"
      });
      setShowCamera(false);
    }
  };

  useEffect(() => {
    if (showCamera) startCamera();
    return () => stopCamera();
  }, [showCamera, stopCamera]);

  const handleManualSubmit = () => {
    if (inputValue.trim()) {
      onScan(inputValue.trim());
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            const val = e.target.value;
            if (onChange) onChange(val);
            else setManualInput(val);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
          className="bg-background"
        />
        <Button type="button" variant="outline" className="shrink-0" onClick={() => setShowCamera(true)}>
          <Camera className="h-4 w-4 mr-2" /> Scan
        </Button>
        <Button type="button" variant="outline" className="shrink-0" onClick={handleManualSubmit}>
          <Keyboard className="h-4 w-4 mr-2" /> Lookup
        </Button>
      </div>

      <Dialog open={showCamera} onOpenChange={(open) => { if (!open) { setShowCamera(false); stopCamera(); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScanBarcode className="h-5 w-5 text-accent" />
              Barcode Scanner
            </DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-32 border-2 border-accent rounded-lg animate-pulse" />
                <p className="absolute bottom-4 text-sm text-accent font-medium bg-background/80 px-3 py-1 rounded-full">
                  Scanning...
                </p>
              </div>
            )}
            {!scanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Initializing camera...</p>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Point your camera at the barcode. Detection happens automatically.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BarcodeScanner;
