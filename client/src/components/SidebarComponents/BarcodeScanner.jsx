// import React, { useEffect, useRef, useState } from "react";
// import Quagga from "quagga";
// import { useNavigate } from "react-router-dom";

// const BarcodeScanner = () => {
//   const videoRef = useRef(null);
//   const navigate = useNavigate();
//   const [manualBarcode, setManualBarcode] = useState("");

//   useEffect(() => {
//     if (!videoRef.current) return;

//     Quagga.init({
//       inputStream: {
//         type: "LiveStream",
//         target: videoRef.current,
//         constraints: {
//           facingMode: "environment", // or "user" for front camera
//         },
//       },
//       decoder: {
//         readers: ["code_128_reader", "ean_reader", "upc_reader"],
//       },
//     }, function (err) {
//       if (!err) {
//         let canvas = document.querySelector("canvas");
//         if (canvas) {
//           let ctx = canvas.getContext("2d", { willReadFrequently: true }); // ✅ Optimize canvas
//         }
//         Quagga.start();
//       }
//     });
    

//     Quagga.onDetected((result) => {
//       const scannedCode = result.codeResult.code;
//       console.log("Scanned Barcode:", scannedCode);
//       Quagga.stop();
//       navigate(`/expiry-form/${scannedCode}`); // ✅ Navigate with scanned barcode
//     });

//     return () => {
//       Quagga.stop();
//     };
//   }, [navigate]);

//   const handleManualSubmit = () => {
//     if (manualBarcode.trim() !== "") {
//       navigate(`/expiry-form/${manualBarcode}`);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center bg-gray-300">
//       <h2 className="text-xl font-bold pt-5">Scan or Enter Barcode</h2>

//       <div className="w-64 h-64 bg-gray-800 flex items-center justify-center">
//         <video ref={videoRef} className="w-full h-full"></video>
//       </div>

//       <div className="mt-2 flex gap-2 pb-3">
//         <input
//           type="text"
//           placeholder="Enter Barcode Number"
//           value={manualBarcode}
//           onChange={(e) => setManualBarcode(e.target.value)}
//           className="border border-gray-600 rounded-2xl p-2 w-48"
//         />
//         <button onClick={handleManualSubmit} className="bg-gray-500 text-white px-4 py-2 rounded">
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BarcodeScanner;




// import React, { useState } from "react";
// import BarcodeScannerComponent from "react-qr-barcode-scanner";
// import { useNavigate } from "react-router-dom";

// const BarcodeScanner = () => {
//   const [barcode, setBarcode] = useState("");
//   const navigate = useNavigate();

//   return (
//     <div className="flex flex-col items-center bg-gray-300">
//       <h2 className="text-xl font-bold pt-5">Scan or Enter Barcode</h2>

//       <div className="w-64 h-64 border border-gray-600 flex items-center justify-center">
//         <BarcodeScannerComponent
//           width={250}
//           height={250}
//           delay={500} // Increase delay to 500ms
//           onUpdate={(err, result) => {
//             if (result) {
//               setBarcode(result.text);
//               navigate(`/expiry-form/${result.text}`);
//             } else if (err) {
//               console.error("❌ Scanning Error:", err);
//             }
//           }}
//         />
//       </div>

//       <div className="mt-2 flex gap-2 pb-3">
//         <input
//           type="text"
//           placeholder="Enter Barcode Number"
//           value={barcode}
//           onChange={(e) => setBarcode(e.target.value)}
//           className="border border-gray-600 rounded-2xl p-2 w-48"
//         />
//         <button
//           onClick={() => navigate(`/expiry-form/${barcode}`)}
//           className="bg-gray-500 text-white px-4 py-2 rounded"
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BarcodeScanner;

import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useNavigate } from "react-router-dom";

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [manualBarcode, setManualBarcode] = useState("");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanner = async () => {
      if (!videoRef.current) return;

      try {
        await codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
          if (result) {
            console.log("Scanned Barcode:", result.text); // ✅ Log scanned barcode
            codeReader.reset();  // ✅ Stop scanning after detecting a barcode
            navigate(`/expiry-form/${result.text}`);
          } else if (err) {
            console.error("Scan Error:", err);
          }
        });
      } catch (err) {
        console.error("Barcode scanning error:", err);
      }
    };

    startScanner();

    return () => {
      codeReader.reset();
      if (videoRef.current?.srcObject) {
        let stream = videoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop()); // ✅ Stop camera when unmounting
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const handleManualSubmit = () => {
    if (manualBarcode.trim() !== "") {
      navigate(`/expiry-form/${manualBarcode}`);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-300">
      <h2 className="text-xl font-bold pt-5">Scan or Enter Barcode</h2>

      <video ref={videoRef} className="w-64 h-64" autoPlay playsInline muted></video>

      <div className="mt-2 flex gap-2 pb-3">
        <input
          type="text"
          placeholder="Enter Barcode Number"
          value={manualBarcode}
          onChange={(e) => setManualBarcode(e.target.value)}
          className="border border-gray-600 rounded-2xl p-2 w-48"
        />
        <button onClick={handleManualSubmit} className="bg-gray-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </div>
    </div>
  );
};

export default BarcodeScanner;







// import React, { useEffect, useRef, useState } from "react";
// import { BrowserMultiFormatReader } from "@zxing/library";
// import { useNavigate } from "react-router-dom";

// const BarcodeScanner = () => {
//   const videoRef = useRef(null);
//   const navigate = useNavigate();
//   const [manualBarcode, setManualBarcode] = useState("");

//   useEffect(() => {
//     const codeReader = new BrowserMultiFormatReader();

//     codeReader
//       .decodeFromVideoDevice(undefined, videoRef.current, (result) => {
//         if (result) {
//           navigate(`/expiry-form/${result.text}`); // Navigate with scanned barcode
//         }
//       })
//       .catch((err) => console.error("Barcode scanning error:", err));

//     return () => {
//       codeReader.reset();
//     };
//   }, [navigate]);

//   // Handle manual input and navigate
//   const handleManualSubmit = () => {
//     if (manualBarcode.trim() !== "") {
//       navigate(`/expiry-form/${manualBarcode}`);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center bg-gray-300">
//       <h2 className="text-xl font-bold pt-5 ">Scan or Enter Barcode</h2>

//       <video ref={videoRef} className="w-64 h-64"></video>

//       <div className="mt-2 flex gap-2 pb-3">
//         <input
//           type="text"
//           placeholder="Enter Barcode Number"
//           value={manualBarcode}
//           onChange={(e) => setManualBarcode(e.target.value)}
//           className="border border-gray-600 rounded-2xl p-2 w-48"
//         />
//         <button onClick={handleManualSubmit} className="bg-gray-500 text-white px-4 py-2 rounded">
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BarcodeScanner;