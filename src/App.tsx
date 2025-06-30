import { useEffect } from "react";
import "./App.css";
import { ZoomMtg } from "@zoom/meetingsdk";

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const sdkKey = urlParams.get("sdkKey") || "";
  const authEndpoint = urlParams.get("authEndpoint") || "";
  const meetingNumber = urlParams.get("meetingNumber") || "";
  const passWord = urlParams.get("passWord") || "";
  const role = urlParams.get("role") ? parseInt(urlParams.get("role")!) : 0;
  const userName = urlParams.get("userName") || "Student";
  const userEmail = urlParams.get("userEmail") || "";
  const registrantToken = "";
  const zakToken = "";
  const leaveUrl = urlParams.get("leaveUrl") || window.location.origin;
  const leaveParams = urlParams.get("leaveParams") || "";

  const getSignature = async () => {
    try {
      const req = await fetch(authEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingNumber: meetingNumber,
          role: role,
        }),
      });
      const res = await req.json();
      const signature = res.signature as string;
      startMeeting(signature);
    } catch (e) {
      console.log(e);
    }
  };

  function startMeeting(signature: string) {
    document.getElementById("zmmtg-root")!.style.display = "block";

    ZoomMtg.init({
      leaveUrl: leaveUrl + leaveParams,
      patchJsMedia: true,
      leaveOnPageUnload: true,
      success: (success: unknown) => {
        console.log(success);
        // can this be async?
        ZoomMtg.join({
          signature: signature,
          sdkKey: sdkKey,
          meetingNumber: meetingNumber,
          passWord: passWord,
          userName: userName,
          userEmail: userEmail,
          tk: registrantToken,
          zak: zakToken,
          success: (success: unknown) => {
            console.log(success);
          },
          error: (error: unknown) => {
            console.log(error);
          },
        });
      },
      error: (error: unknown) => {
        console.log(error);
      },
    });
  }

  useEffect(() => {
    getSignature();
  }, []);

  return (
    <div className="App">
      <main>
        <h1 style={{ marginTop: 20 }}>Meeting</h1>
      </main>
    </div>
  );
}

export default App;
