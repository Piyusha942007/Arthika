module.exports = [
    // ================= LEVEL 1: My Identity & My Bank =================
    {
        level: 1, stage: 1, language: 'english', questions: [
            { questionText: "Why is an Aadhaar card important for opening a bank account?", options: ["It serves as primary proof of identity and address.", "It acts as a debit card.", "It guarantees you a free loan.", "It replaces the need for money."], correctOptionIndex: 0 },
            { questionText: "What does the PAN card primarily track?", options: ["Your medical health.", "Your official financial transactions and taxes.", "Your daily travel.", "Your online shopping habits."], correctOptionIndex: 1 },
            { questionText: "Can you open a formal bank account without any identity documents?", options: ["Yes, banks allow anyone to open accounts.", "No, KYC documents like Aadhaar and PAN are required by the RBI.", "Only if you deposit more than Rs. 50,000.", "Only if you act as a group."], correctOptionIndex: 1 },
            { questionText: "Why do we need to prove our identity to the bank?", options: ["To prevent fraud and ensure money goes to the rightful owner.", "To pay extra fees to the government.", "Because it's a new rule for women only.", "To delay the account opening process."], correctOptionIndex: 0 },
            { questionText: "If a woman does not have a PAN card, what is an alternative for opening a basic bank account?", options: ["Submitting Form 60 along with Aadhaar.", "Giving a thumbprint on a blank paper.", "Borrowing a neighbor's PAN card.", "She cannot open an account."], correctOptionIndex: 0 }
        ]
    },
    {
        level: 1, stage: 1, language: 'hindi', questions: [
            { questionText: "बैंक खाता खोलने के लिए आधार कार्ड क्यों महत्वपूर्ण है?", options: ["यह पहचान और पते के प्राथमिक प्रमाण के रूप में कार्य करता है।", "यह डेबिट कार्ड के रूप में कार्य करता है।", "यह आपको मुफ्त ऋण (लोन) की गारंटी देता है।", "यह पैसे की आवश्यकता को बदल देता है।"], correctOptionIndex: 0 },
            { questionText: "पैन (PAN) कार्ड मुख्य रूप से क्या ट्रैक करता है?", options: ["आपका स्वास्थ्य।", "आपके आधिकारिक वित्तीय लेनदेन और कर (टैक्स)।", "आपकी दैनिक यात्रा।", "आपकी ऑनलाइन शॉपिंग।"], correctOptionIndex: 1 },
            { questionText: "क्या आप पहचान दस्तावेजों के बिना औपचारिक बैंक खाता खोल सकते हैं?", options: ["हाँ, बैंक किसी को भी अनुमति देते हैं।", "नहीं, RBI द्वारा आधार और पैन जैसे KYC दस्तावेज़ अनिवार्य हैं।", "केवल यदि 50,000 रुपये जमा करें।", "विवाहित महिलाओं के लिए दस्तावेज़ की आवश्यकता नहीं है।"], correctOptionIndex: 1 },
            { questionText: "हमें बैंक को अपनी पहचान साबित करने की आवश्यकता क्यों है?", options: ["धोखाधड़ी को रोकने और यह सुनिश्चित करने के लिए कि पैसा सही मालिक को मिले।", "सरकार को अतिरिक्त शुल्क का भुगतान करने के लिए।", "क्योंकि यह केवल महिलाओं के लिए एक नया नियम है।", "खाता खोलने की प्रक्रिया में देरी करने के लिए।"], correctOptionIndex: 0 },
            { questionText: "यदि किसी व्यक्ति के पास पैन कार्ड नहीं है, तो मूल बैंक खाता खोलने का विकल्प क्या है?", options: ["आधार के साथ फॉर्म 60 (Form 60) जमा करना।", "कोरे कागज पर अंगूठे का निशान देना।", "पड़ोसी का पैन कार्ड उधार लेना।", "वे खाता नहीं खोल सकते।"], correctOptionIndex: 0 }
        ]
    },

    {
        level: 1, stage: 2, language: 'english', questions: [
            { questionText: "What is a major feature of a Zero-Balance (BSBD) account?", options: ["It earns zero interest.", "It does not require maintaining a minimum monthly balance and has no penalty for low balances.", "It requires a Rs. 10,000 initial deposit.", "It does not provide an ATM card."], correctOptionIndex: 1 },
            { questionText: "Why is a regular Savings Account good for managing household money?", options: ["It keeps cash safe and earns a small interest over time.", "It doubles the money in one year.", "It allows you to take unlimited loans.", "It locks money so you can never withdraw it."], correctOptionIndex: 0 },
            { questionText: "What is the primary difference between a Savings Account and a Current Account?", options: ["Savings is for daily business, Current is for personal savings.", "Current Accounts are meant for businesses and usually don't pay interest; Savings Accounts are for personal saving and earn interest.", "Current Accounts have zero balance features, Savings require 1 Lakh.", "There is no difference."], correctOptionIndex: 1 },
            { questionText: "Are Jan Dhan Accounts considered zero-balance accounts?", options: ["Yes, PMJDY accounts can be opened with zero balance.", "No, they require Rs. 500.", "No, they are for businesses only.", "Only for men."], correctOptionIndex: 0 },
            { questionText: "Why might a woman prefer a bank account over keeping cash at home?", options: ["To protect it from theft, fires, and unnecessary spending.", "To hide it from the government.", "To pay ATM fees.", "To make the bank rich."], correctOptionIndex: 0 }
        ]
    },
    {
        level: 1, stage: 2, language: 'hindi', questions: [
            { questionText: "'जीरो-बैलेंस' (BSBD) खाते की प्रमुख विशेषता क्या है?", options: ["इस पर शून्य ब्याज मिलता है।", "इसमें न्यूनतम मासिक बैलेंस बनाए रखने की आवश्यकता नहीं होती है और पेनाल्टी नहीं लगती है।", "इसके लिए 10,000 रुपये जमा करने की आवश्यकता होती है।", "यह एटीएम कार्ड प्रदान नहीं करता है।"], correctOptionIndex: 1 },
            { questionText: "घर के पैसे के प्रबंधन के लिए नियमित बचत खाता (Savings Account) क्यों अच्छा है?", options: ["यह नकदी को सुरक्षित रखता है और समय के साथ इस पर ब्याज मिलता है।", "यह एक साल में पैसा दोगुना कर देता है।", "यह आपको असीमित ऋण लेने की अनुमति देता है।", "यह पैसे को लॉक कर देता है।"], correctOptionIndex: 0 },
            { questionText: "बचत खाते और चालू खाते (Current Account) के बीच प्राथमिक अंतर क्या है?", options: ["बचत व्यवसाय के लिए है, चालू खाते व्यक्तिगत बचत के लिए है।", "चालू खाते व्यवसायों के लिए हैं और ब्याज नहीं देते; बचत खाते व्यक्तिगत बचत के लिए हैं और ब्याज देते हैं।", "कोई अंतर नहीं है।", "चालू खाते केवल गाँव में खुलते हैं।"], correctOptionIndex: 1 },
            { questionText: "क्या जन-धन (PMJDY) खाते जीरो-बैलेंस खाते माने जाते हैं?", options: ["हाँ, जन-धन खाते शून्य बैलेंस के साथ खोले जा सकते हैं।", "नहीं, उन्हें 500 रुपये की आवश्यकता है।", "नहीं, वे केवल व्यवसायों के लिए हैं।", "केवल पुरुषों के लिए।"], correctOptionIndex: 0 },
            { questionText: "एक महिला घर पर नकद रखने की बजाय बैंक खाते को प्राथमिकता क्यों दे सकती है?", options: ["इसे चोरी और अनावश्यक खर्च से बचाने के लिए।", "इसे सरकार से छिपाने के लिए।", "एटीएम शुल्क का भुगतान करने के लिए।", "बैंक को अमीर बनाने के लिए।"], correctOptionIndex: 0 }
        ]
    },

    {
        level: 1, stage: 3, language: 'english', questions: [
            { questionText: "What does KYC stand for in the banking process?", options: ["Keep Your Cash", "Know Your Customer", "Kindness Yearly Check", "Kerosene Yield Cost"], correctOptionIndex: 1 },
            { questionText: "When visiting a bank branch to open an account, what must you physically sign or verify?", options: ["Your property deed.", "An application form and your specimen signature.", "A tax contract.", "A group loan agreement."], correctOptionIndex: 1 },
            { questionText: "Why does the bank ask for recent passport-size photographs during KYC?", options: ["To put on their advertisement boards.", "To link your face to your banking records for visual identification and fraud prevention.", "To print on the passbook cover only.", "To send to the police."], correctOptionIndex: 1 },
            { questionText: "Is it safe to hand over original documents like Aadhaar to bank agents outside the bank?", options: ["Yes, it saves time.", "No, always provide self-attested copies and show the original only at official bank counters to avoid misuse.", "Yes, as long as they promise to return it.", "Depends on the agent's behavior."], correctOptionIndex: 1 },
            { questionText: "What is a 'Passbook'?", options: ["A book to write passwords.", "A physical book provided by the bank that records all money deposited and withdrawn from your account.", "A book that teaches you banking.", "A government diary."], correctOptionIndex: 1 }
        ]
    },
    {
        level: 1, stage: 3, language: 'hindi', questions: [
            { questionText: "बैंकिंग प्रक्रिया में KYC का पूर्ण रूप क्या है?", options: ["Keep Your Cash", "Know Your Customer (अपने ग्राहक को जानें)", "Know Your Company", "Keep Your Card"], correctOptionIndex: 1 },
            { questionText: "खाता खोलने के लिए बैंक शाखा में जाते समय, आपको क्या हस्ताक्षर करना या सत्यापित करना होगा?", options: ["आपकी संपत्ति का डीड।", "एक आवेदन पत्र (Application form) और आपका नमूना हस्ताक्षर (Signature)।", "एक कर अनुबंध।", "एक समूह ऋण समझौता।"], correctOptionIndex: 1 },
            { questionText: "KYC के दौरान बैंक हाल की पासपोर्ट आकार की तस्वीरें क्यों मांगता है?", options: ["अपने विज्ञापन बोर्डों पर लगाने के लिए।", "पहचान और धोखाधड़ी की रोकथाम के लिए आपके चेहरे को आपके बैंकिंग रिकॉर्ड से जोड़ने के लिए।", "केवल पासबुक कवर पर प्रिंट करने के लिए।", "पुलिस को भेजने के लिए।"], correctOptionIndex: 1 },
            { questionText: "क्या बैंक के बाहर एजेंटों को मूल दस्तावेज़ (जैसे आधार) सौंपना सुरक्षित है?", options: ["हाँ, इससे समय की बचत होती है।", "नहीं, हमेशा स्वयं-सत्यापित प्रतियां प्रदान करें और दुरुपयोग से बचने के लिए मूल दस्तावेज़ केवल आधिकारिक बैंक काउंटरों पर दिखाएं।", "हाँ, जब तक वे इसे वापस करने का वादा करते हैं।", "एजेंट के व्यवहार पर निर्भर करता है।"], correctOptionIndex: 1 },
            { questionText: "पासबुक (Passbook) क्या है?", options: ["पासवर्ड लिखने की किताब।", "बैंक द्वारा प्रदान की गई एक भौतिक पुस्तक जो आपके खाते में जमा और निकाले गए सभी पैसों का रिकॉर्ड रखती है।", "एक किताब जो आपको बैंकिंग सिखाती है।", "एक सरकारी डायरी।"], correctOptionIndex: 1 }
        ]
    },

    // ================= LEVEL 2: The Digital Leap =================
    {
        level: 2, stage: 1, language: 'english', questions: [
            { questionText: "What is UPI (Unified Payments Interface)?", options: ["A traditional bank branch.", "A system that powers multiple bank accounts into a single mobile application for instant transfers.", "A new type of physical debit card.", "An interest payment scheme."], correctOptionIndex: 1 },
            { questionText: "To set up a UPI app like PhonePe or Google Pay, what MUST match?", options: ["Your phone model and bank name.", "The mobile number in your smartphone and the mobile number registered with your bank account.", "Your age and account balance.", "Your language and the app language."], correctOptionIndex: 1 },
            { questionText: "What is a UPI PIN?", options: ["A public passcode shared with friends.", "A secure 4 or 6-digit passcode you enter to authorize and deduct money from your account.", "A password for logging into Facebook.", "A code sent by the receiver."], correctOptionIndex: 1 },
            { questionText: "Can UPI work on an offline feature phone?", options: ["No, it requires 5G only.", "Yes, via the *99# USSD service, even without internet.", "Yes, but you have to visit an ATM first.", "Only if scanning QR codes."], correctOptionIndex: 1 },
            { questionText: "What do you need linking to your mobile number to create your first UPI ID?", options: ["An active debit/ATM card.", "A credit card.", "A fixed deposit receipt.", "An Aadhaar card alone."], correctOptionIndex: 0 }
        ]
    },
    {
        level: 2, stage: 1, language: 'hindi', questions: [
            { questionText: "UPI (यूनिफाइड पेमेंट्स इंटरफेस) क्या है?", options: ["एक पारंपरिक बैंक शाखा।", "एक प्रणाली जो तत्काल धन हस्तांतरण (transfer) के लिए एक ही मोबाइल एप्लिकेशन में कई बैंक खातों को संचालित करती है।", "एक नए प्रकार का भौतिक डेबिट कार्ड।", "ब्याज भुगतान योजना।"], correctOptionIndex: 1 },
            { questionText: "UPI ऐप (जैसे PhonePe) सेटअप करने के लिए, क्या मिलना आवश्यक है?", options: ["आपका फोन मॉडल और बैंक का नाम।", "आपके स्मार्टफ़ोन में मौजूद मोबाइल नंबर और आपके बैंक खाते में पंजीकृत (registered) मोबाइल नंबर समान होना चाहिए।", "आपकी उम्र और खाता शेष।", "आपकी भाषा और ऐप की भाषा।"], correctOptionIndex: 1 },
            { questionText: "UPI PIN क्या है?", options: ["दोस्तों के साथ साझा किया जाने वाला सार्वजनिक पासकोड।", "एक सुरक्षित 4 या 6 अंकों का गुप्त पासवर्ड जिसे आप अपने खाते से पैसे काटने और भुगतान को अधिकृत (authorize) करने के लिए दर्ज करते हैं।", "फेसबुक का पासवर्ड।", "प्राप्तकर्ता द्वारा भेजा गया कोड।"], correctOptionIndex: 1 },
            { questionText: "क्या UPI बिना इंटरनेट वाले फीचर फोन (कीपैड वाले फ़ोन) पर काम कर सकता है?", options: ["नहीं, इसके लिए 5G की आवश्यकता है।", "हाँ, *99# USSD सेवा के माध्यम से, बिना इंटरनेट के भी।", "हाँ, लेकिन पहले एटीएम जाना पड़ता है।", "केवल QR कोड स्कैन करते समय।"], correctOptionIndex: 1 },
            { questionText: "अपनी पहली UPI ID बनाने के लिए आपके मोबाइल नंबर से क्या जुड़ा होना चाहिए?", options: ["एक सक्रिय डेबिट/ATM कार्ड।", "एक क्रेडिट कार्ड।", "सावधि जमा (FD) रसीद।", "केवल आधार कार्ड।"], correctOptionIndex: 0 }
        ]
    },

    {
        level: 2, stage: 2, language: 'english', questions: [
            { questionText: "When should you enter your UPI PIN?", options: ["When you are receiving money or claiming a prize.", "ONLY when you are SENDING money from your account to someone else.", "Whenever a caller asks you to.", "To check someone else's balance."], correctOptionIndex: 1 },
            { questionText: "What does scanning a QR code at a shop do?", options: ["It pays you money.", "It quickly identifies the shopkeeper's account details so you can enter the amount and send payment securely.", "It shows you the shop's menu.", "It deducts a random amount from your account automatically."], correctOptionIndex: 1 },
            { questionText: "If a stranger sends you a 'Payment Request' link saying 'Click to receive Rs 1000', what should you do?", options: ["Click the link and enter your PIN to claim it.", "Decline it immediately, as entering your PIN will actually deduct money from you.", "Forward it to a friend.", "Call the number back and give your bank details."], correctOptionIndex: 1 },
            { questionText: "How can you verify you are paying the correct person?", options: ["Just guess the number.", "The UPI app displays the registered name of the receiver before you enter your PIN.", "Wait for a text message.", "Ask the bank branch later."], correctOptionIndex: 1 },
            { questionText: "What should you do before confirming a large digital payment?", options: ["Double-check the amount typed and the receiver's name carefully.", "Disconnect the internet.", "Turn off your phone.", "Ask a stranger to do it for you."], correctOptionIndex: 0 }
        ]
    },
    {
        level: 2, stage: 2, language: 'hindi', questions: [
            { questionText: "आपको अपना UPI PIN कब दर्ज करना चाहिए?", options: ["जब आप पैसे प्राप्त कर रहे हों या पुरस्कार का दावा कर रहे हों।", "केवल तब जब आप अपने खाते से किसी को पैसे भेज (SEND) रहे हों।", "जब भी कोई कॉलर आपसे पूछे।", "किसी और का बैलेंस चेक करने के लिए।"], correctOptionIndex: 1 },
            { questionText: "दुकान पर QR कोड स्कैन करने से क्या होता है?", options: ["यह आपको पैसे देता है।", "यह जल्दी से दुकानदार के खाते का विवरण पहचान लेता है ताकि आप सुरक्षित रूप से भुगतान भेज सकें।", "यह आपको दुकान का मेनू दिखाता है।", "यह स्वचालित रूप से आपके खाते से राशि काट लेता है।"], correctOptionIndex: 1 },
            { questionText: "अगर कोई अजनबी आपको 'भुगतान अनुरोध' (Payment Request) लिंक भेजता है और कहता है '1000 रुपये प्राप्त करने के लिए क्लिक करें', तो आपको क्या करना चाहिए?", options: ["इसे प्राप्त करने के लिए लिंक पर क्लिक करें और अपना पिन दर्ज करें।", "इसे तुरंत अस्वीकार करें, क्योंकि पिन दर्ज करने से वास्तव में आपके पैसे कट जाएंगे।", "इसे किसी मित्र को अग्रेषित (forward) करें।", "नंबर पर वापस कॉल करें और अपने बैंक विवरण दें।"], correctOptionIndex: 1 },
            { questionText: "आप यह कैसे जांच सकते हैं कि आप सही व्यक्ति को भुगतान कर रहे हैं?", options: ["बस नंबर का अनुमान लगाएं।", "UPI ऐप पिन दर्ज करने से पहले प्राप्तकर्ता का पंजीकृत (Registered) नाम प्रदर्शित करता है।", "टेक्स्ट संदेश की प्रतीक्षा करें।", "बाद में बैंक शाखा से पूछें।"], correctOptionIndex: 1 },
            { questionText: "बड़ा डिजिटल भुगतान करने से पहले क्या करना चाहिए?", options: ["टाइप की गई राशि और प्राप्तकर्ता के नाम की सावधानीपूर्वक दोबारा जांच करें।", "इंटरनेट बंद कर दें।", "अपना फोन बंद कर दें।", "किसी अजनबी को इसे करने के लिए कहें।"], correctOptionIndex: 0 }
        ]
    },

    {
        level: 2, stage: 3, language: 'english', questions: [
            { questionText: "What is an m-Passbook or Digital Bank Statement?", options: ["A list of items you bought online.", "A digital record on your mobile app showing all incoming and outgoing money for your bank account.", "A printed book given once a year.", "A messaging app."], correctOptionIndex: 1 },
            { questionText: "When looking at a bank statement, what does a 'CREDIT' entry mean?", options: ["Money has been deducted (taken out) from your account.", "Money has been added (deposited) into your account.", "The bank has frozen your account.", "You requested a loan."], correctOptionIndex: 1 },
            { questionText: "What does a 'DEBIT' entry usually signify?", options: ["Money was added to your account.", "Money was deducted from your account (e.g., spending via UPI or ATM withdrawal).", "Interest was paid to you.", "You received a government subsidy."], correctOptionIndex: 1 },
            { questionText: "Why is it important to regularly track your digital statement?", options: ["To ensure the bank doesn't close your account.", "To catch any unauthorized or mistaken deductions immediately and monitor your spending habits.", "To increase your bank balance artificially.", "Because the government requires daily checks."], correctOptionIndex: 1 },
            { questionText: "What should you do if you notice a Debit transaction on your statement that you did not make?", options: ["Ignore it if it is a small amount.", "Immediately contact your bank's toll-free number to report fraud and block your card/account.", "Wait for next month's statement.", "Write a letter to the shopkeeper."], correctOptionIndex: 1 }
        ]
    },
    {
        level: 2, stage: 3, language: 'hindi', questions: [
            { questionText: "एम-पासबुक (m-Passbook) या डिजिटल बैंक स्टेटमेंट क्या है?", options: ["आपके द्वारा ऑनलाइन खरीदी गई वस्तुओं की सूची।", "आपके मोबाइल ऐप पर एक डिजिटल रिकॉर्ड जो आपके बैंक खाते में आने और जाने वाले सभी पैसों को दिखाता है।", "साल में एक बार दी जाने वाली मुद्रित पुस्तक।", "एक मैसेजिंग ऐप।"], correctOptionIndex: 1 },
            { questionText: "बैंक स्टेटमेंट देखते समय, 'क्रेडिट' (CREDIT/Cr) प्रविष्टि का क्या अर्थ है?", options: ["आपके खाते से पैसे काटे गए हैं।", "आपके खाते में पैसे जोड़े (जमा) गए हैं।", "बैंक ने आपका खाता फ्रीज कर दिया है।", "आपने लोन का अनुरोध किया है।"], correctOptionIndex: 1 },
            { questionText: "'डेबिट' (DEBIT/Dr) प्रविष्टि आमतौर पर क्या दर्शाती है?", options: ["आपके खाते में पैसे जोड़े गए।", "आपके खाते से पैसे काटे गए (जैसे, UPI से खर्च या ATM से नकद निकासी)।", "आपको ब्याज का भुगतान किया गया।", "आपको सरकारी सब्सिडी मिली।"], correctOptionIndex: 1 },
            { questionText: "नियमित रूप से अपने डिजिटल स्टेटमेंट (Passbook) को ट्रैक करना क्यों महत्वपूर्ण है?", options: ["यह सुनिश्चित करने के लिए कि बैंक खाता बंद न करे।", "किसी भी अनधिकृत या गलत कटौती को तुरंत पकड़ने और अपनी खर्च करने की आदतों को ट्रैक करने के लिए।", "बैलेंस बढ़ाने के लिए।", "क्योंकि सरकार ऐसा करने को कहती है।"], correctOptionIndex: 1 },
            { questionText: "यदि आप अपने स्टेटमेंट पर कोई ऐसा डेबिट (पैसे कटना) देखते हैं जो आपने नहीं किया है, तो आपको क्या करना चाहिए?", options: ["अगर यह छोटी रकम है तो इसे नज़रअंदाज़ करें।", "धोखाधड़ी की रिपोर्ट करने और अपना कार्ड/खाता ब्लॉक करने के लिए तुरंत अपने बैंक के टोल-फ्री नंबर पर संपर्क करें।", "अगले महीने की पासबुक की प्रतीक्षा करें।", "दुकानदार को पत्र लिखें।"], correctOptionIndex: 1 }
        ]
    },

    // ================= LEVEL 3: The Power of the Group =================
    {
        level: 3, stage: 1, language: 'english', questions: [
            { questionText: "What does SHG stand for?", options: ["Self Help Group", "School Health Group", "Saving High Gold", "Social Home Gathering"], correctOptionIndex: 0 },
            { questionText: "What is a Self-Help Group (SHG)?", options: ["A government bank branch.", "An informal association of 10-20 local women who come together to find ways to improve their living conditions.", "A protest group.", "A school committee."], correctOptionIndex: 1 },
            { questionText: "Why is the number of members in an SHG usually kept between 10 to 20?", options: ["To make it a large corporation.", "To ensure cohesive decision making, build strong trust, and allow everyone a voice.", "Because banks do not allow large groups.", "It is the law of the police."], correctOptionIndex: 1 },
            { questionText: "What is the primary foundation of an SHG?", options: ["Mutual trust, regular meetings, and cooperative saving.", "High profits and risky investments.", "Depending entirely on government handouts.", "Competing against each other."], correctOptionIndex: 0 },
            { questionText: "Can an SHG empower a woman socially, apart from financially?", options: ["No, it only deals with money.", "Yes, by giving them a collective voice, leadership experience, and an identity outside the home.", "Only if she becomes the president.", "No, society rejects SHGs."], correctOptionIndex: 1 }
        ]
    },
    {
        level: 3, stage: 1, language: 'hindi', questions: [
            { questionText: "SHG का पूर्ण रूप क्या है?", options: ["सेल्फ हेल्प ग्रुप (स्वयं सहायता समूह)", "स्कूल हेल्थ ग्रुप", "सेविंग हाई गोल्ड", "सोशल होम गैदरिंग"], correctOptionIndex: 0 },
            { questionText: "स्वयं सहायता समूह (SHG) क्या है?", options: ["एक सरकारी बैंक शाखा।", "10-20 स्थानीय महिलाओं का एक अनौपचारिक समूह जो अपनी जीवन स्थितियों को बेहतर बनाने के तरीके खोजने के लिए एक साथ आती हैं।", "एक विरोध समूह।", "एक स्कूल समिति।"], correctOptionIndex: 1 },
            { questionText: "SHG में सदस्यों की संख्या आमतौर पर 10 से 20 के बीच क्यों रखी जाती है?", options: ["इसे एक बड़ा निगम बनाने के लिए।", "निर्णय लेने में आसानी, मजबूत विश्वास बनाने और सभी को अपनी बात रखने का मौका देने के लिए।", "क्योंकि बैंक बड़े समूहों को अनुमति नहीं देते हैं।", "यह पुलिस का नियम है।"], correctOptionIndex: 1 },
            { questionText: "SHG की प्राथमिक नींव क्या है?", options: ["आपसी विश्वास, नियमित बैठकें और सहकारी बचत।", "उच्च लाभ और जोखिम भरा निवेश।", "पूरी तरह से सरकारी भिक्षा पर निर्भर रहना।", "एक दूसरे से प्रतिस्पर्धा करना।"], correctOptionIndex: 0 },
            { questionText: "क्या SHG किसी महिला को आर्थिक रूप से सशक्त बनाने के अलावा सामाजिक रूप से भी सशक्त बना सकता है?", options: ["नहीं, यह केवल पैसे का सौदा करता है।", "हाँ, उन्हें सामूहिक आवाज़, नेतृत्व (Leadership) का अनुभव और घर के बाहर एक पहचान देकर।", "केवल अगर वह अध्यक्ष (President) बन जाती है।", "नहीं, समाज SHG को अस्वीकार करता है।"], correctOptionIndex: 1 }
        ]
    },

    {
        level: 3, stage: 2, language: 'english', questions: [
            { questionText: "Why is it important for an SHG to have strict rules?", options: ["To punish members.", "To instill discipline, ensure regular attendance, and manage the collected money fairly.", "To make the meetings boring.", "To stop members from saving."], correctOptionIndex: 1 },
            { questionText: "What role does the 'President' or 'Animator' play in an SHG?", options: ["They keep all the money for themselves.", "They guide the meetings, encourage participation, and ensure records are kept accurately.", "They ban members from speaking.", "They act as the bank manager."], correctOptionIndex: 1 },
            { questionText: "Why are minutes (written records) maintained for every SHG meeting?", options: ["To practice handwriting.", "To provide transparency, tracking who attended, what was discussed, and who paid their savings/loans.", "To send to the Prime Minister.", "It is a waste of time."], correctOptionIndex: 1 },
            { questionText: "How should decisions be made in a successful SHG?", options: ["The President decides everything alone.", "Through democratic discussion and consensus (agreement) among all members.", "By tossing a coin.", "By asking outsiders."], correctOptionIndex: 1 },
            { questionText: "What happens if a member continuously misses SHG meetings without valid reasons?", options: ["Nothing happens.", "The group rules (usually involving small fines) are applied to enforce discipline.", "The bank sues them.", "They are sent to jail."], correctOptionIndex: 1 }
        ]
    },
    {
        level: 3, stage: 2, language: 'hindi', questions: [
            { questionText: "एक SHG के लिए सख्त नियम होना क्यों महत्वपूर्ण है?", options: ["सदस्यों को दंडित करने के लिए।", "अनुशासन पैदा करने, नियमित उपस्थिति सुनिश्चित करने और एकत्रित धन का उचित प्रबंधन करने के लिए।", "बैठकों को उबाऊ बनाने के लिए।", "सदस्यों को बचत करने से रोकने के लिए।"], correctOptionIndex: 1 },
            { questionText: "SHG में 'अध्यक्ष' (President) की क्या भूमिका है?", options: ["वे सारा पैसा अपने पास रखते हैं।", "वे बैठकों का मार्गदर्शन करते हैं, भागीदारी को प्रोत्साहित करते हैं और सुनिश्चित करते हैं कि रिकॉर्ड सही ढंग से रखे गए हैं।", "वे सदस्यों को बोलने से रोकते हैं।", "वे बैंक मैनेजर की तरह काम करते हैं।"], correctOptionIndex: 1 },
            { questionText: "प्रत्येक SHG बैठक के लिए लिखित रिकॉर्ड (Minutes) क्यों रखे जाते हैं?", options: ["हैंडराइटिंग का अभ्यास करने के लिए।", "पारदर्शिता (Transparency) प्रदान करने और यह ट्रैक करने के लिए कि कौन उपस्थित था, क्या चर्चा हुई और किसने बचत/ऋण का भुगतान किया।", "प्रधान मंत्री को भेजने के लिए।", "यह समय की बर्बादी है।"], correctOptionIndex: 1 },
            { questionText: "एक सफल SHG में निर्णय कैसे लिए जाने चाहिए?", options: ["अध्यक्ष अकेले सब कुछ तय करता है।", "सभी सदस्यों के बीच लोकतांत्रिक चर्चा और आम सहमति (सहमति) के माध्यम से।", "सिक्का उछालकर।", "बाहरी लोगों से पूछकर।"], correctOptionIndex: 1 },
            { questionText: "क्या होगा यदि कोई सदस्य बिना वैध कारणों के लगातार SHG बैठकों में शामिल नहीं होता है?", options: ["कुछ नहीं होता है।", "अनुशासन लागू करने के लिए समूह के नियम (आमतौर पर छोटा जुर्माना शामिल होता है) लागू किए जाते हैं।", "बैंक उन पर मुकदमा करता है।", "उन्हें जेल भेज दिया जाता है।"], correctOptionIndex: 1 }
        ]
    },

    {
        level: 3, stage: 3, language: 'english', questions: [
            { questionText: "What does 'Pooling savings' mean in an SHG context?", options: ["Every member contributes a small, agreed-upon amount regularly (e.g., weekly/monthly) to build a large common fund.", "Swimming in a pool of coins.", "Borrowing from the bank.", "Giving money to the village head."], correctOptionIndex: 0 },
            { questionText: "Why is saving a small amount (like Rs. 50 a week) powerful collectively?", options: ["It isn't powerful.", "When 20 women save Rs 50 weekly, it becomes Rs 4000 a month, creating a significant fund over time.", "It allows buying groceries instantly.", "Because it loses value."], correctOptionIndex: 1 },
            { questionText: "Where should the SHG's pooled money be kept safely?", options: ["In a tin box buried underground.", "Under the President's mattress.", "In a dedicated SHG bank account jointly operated by group representatives.", "At a local shopkeeper's desk."], correctOptionIndex: 2 },
            { questionText: "What is the primary rule for withdrawing savings in an SHG?", options: ["Anyone can take the box home.", "Members cannot withdraw their base savings randomly; the pool is instead used to give loans to members in need.", "Only the richest member can use it.", "It is given away as charity."], correctOptionIndex: 1 },
            { questionText: "The habit of regular saving in an SHG builds what crucial skill?", options: ["Financial discipline and long-term planning.", "How to spend money fast.", "Ignoring bank systems.", "How to avoid paying taxes."], correctOptionIndex: 0 }
        ]
    },
    {
        level: 3, stage: 3, language: 'hindi', questions: [
            { questionText: "SHG के संदर्भ में 'बचत पूल करना' (Pooling Savings) का क्या अर्थ है?", options: ["प्रत्येक सदस्य एक बड़ा सामान्य फंड बनाने के लिए नियमित रूप से (जैसे हर हफ्ते) एक छोटी राशि का योगदान देता है।", "सिक्कों के पूल में तैरना।", "बैंक से उधार लेना।", "गांव के मुखिया को पैसे देना।"], correctOptionIndex: 0 },
            { questionText: "सामूहिक रूप से एक छोटी राशि (जैसे 50 रुपये प्रति सप्ताह) की बचत करना शक्तिशाली क्यों है?", options: ["यह शक्तिशाली नहीं है।", "जब 20 महिलाएं साप्ताहिक 50 रुपये बचाती हैं, तो यह एक महीने में 4000 रुपये हो जाता है, जो समय के साथ एक महत्वपूर्ण फंड बनाता है।", "यह तुरंत किराने का सामान खरीदने की अनुमति देता है।", "क्योंकि यह मूल्य खो देता है।"], correctOptionIndex: 1 },
            { questionText: "SHG के जमा किए गए पैसे (Pooled money) को सुरक्षित रूप से कहाँ रखा जाना चाहिए?", options: ["जमीन में गाड़े गए टीन के डिब्बे में।", "अध्यक्ष के गद्दे के नीचे।", "समूह के प्रतिनिधियों द्वारा संयुक्त रूप से संचालित एक समर्पित SHG बैंक खाते में।", "स्थानीय दुकानदार की मेज पर।"], correctOptionIndex: 2 },
            { questionText: "SHG में बचत के पैसे के उपयोग का प्राथमिक नियम क्या है?", options: ["कोई भी पैसा घर ले जा सकता है।", "सदस्य अपनी बचत को यों ही नहीं निकाल सकते; इसके बजाय पूल का उपयोग जरूरत मंद सदस्यों को ऋण(Loan) देने के लिए किया जाता है।", "केवल सबसे अमीर सदस्य इसका उपयोग कर सकता है।", "इसे दान के रूप में दिया जाता है।"], correctOptionIndex: 1 },
            { questionText: "SHG में नियमित बचत की आदत से कौन सा महत्वपूर्ण कौशल विकसित होता है?", options: ["वित्तीय अनुशासन और दीर्घकालिक योजना।", "पैसे तेजी से कैसे खर्च करें।", "बैंक प्रणालियों की अनदेखी करना।", "कर (टैक्स) चुकाने से कैसे बचें।"], correctOptionIndex: 0 }
        ]
    },

    // ================= LEVEL 4: Group Growth & Lending =================
    {
        level: 4, stage: 1, language: 'english', questions: [
            { questionText: "What is 'Internal Lending' within an SHG?", options: ["Taking loans from a foreign bank.", "Using the accumulated pooled savings to give small loans to group members at agreed interest rates.", "Lending money to the government.", "Taking loans from a local moneylender."], correctOptionIndex: 1 },
            { questionText: "Why is taking a loan from the SHG better than a local moneylender?", options: ["Interest rates are fair, decided by the group, and profits go back to the group's own fund.", "Local lenders are too slow.", "The group never asks for the money back.", "There is no documentation."], correctOptionIndex: 0 },
            { questionText: "Who decides who gets an internal loan from the SHG pool?", options: ["The bank manager.", "The group collectively decides based on urgency and priority of the member's need.", "The village chief.", "A lottery system."], correctOptionIndex: 1 },
            { questionText: "When an SHG member repays an internal loan with interest, who benefits?", options: ["The bank manager.", "The entire group, because the interest paid grows the group's common savings pool.", "Only the President.", "The government."], correctOptionIndex: 1 },
            { questionText: "What happens if an internal loan is not repaid by a member?", options: ["The group suffers a loss, highlighting the importance of peer pressure and trust in ensuring repayments.", "Nothing, it's forgiven.", "The bank pays it off.", "The police immediately arrest her."], correctOptionIndex: 0 }
        ]
    },
    {
        level: 4, stage: 1, language: 'hindi', questions: [
            { questionText: "SHG के भीतर 'आंतरिक ऋण' (Internal Lending) क्या है?", options: ["किसी विदेशी बैंक से ऋण लेना।", "एकत्रित बचत का उपयोग समूह के सदस्यों को सहमत ब्याज दरों पर छोटे ऋण (Loan) देने के लिए करना।", "सरकार को पैसे उधार देना।", "स्थानीय साहूकार से ऋण लेना।"], correctOptionIndex: 1 },
            { questionText: "स्थानीय साहूकार (Moneylender) की तुलना में SHG से ऋण लेना बेहतर क्यों है?", options: ["ब्याज दरें उचित होती हैं, समूह द्वारा तय की जाती हैं, और लाभ समूह के अपने फंड में वापस जाता है।", "स्थानीय ऋणदाता बहुत धीमे होते हैं।", "समूह कभी पैसे वापस नहीं मांगता।", "कोई दस्तावेज़ नहीं है।"], correctOptionIndex: 0 },
            { questionText: "SHG पूल से आंतरिक ऋण (Loan) किसे मिलेगा, यह कौन तय करता है?", options: ["बैंक मैनेजर।", "समूह सामूहिक रूप से सदस्य की आवश्यकता की तात्कालिकता और प्राथमिकता के आधार पर निर्णय लेता है।", "ग्राम प्रधान।", "एक लॉटरी प्रणाली।"], correctOptionIndex: 1 },
            { questionText: "जब कोई SHG सदस्य ब्याज के साथ आंतरिक ऋण चुकाता है, तो किसे लाभ होता है?", options: ["बैंक मैनेजर को।", "पूरे समूह को, क्योंकि चुकाया गया ब्याज समूह के सामान्य बचत पूल को बढ़ाता है।", "केवल अध्यक्ष को।", "सरकार को।"], correctOptionIndex: 1 },
            { questionText: "यदि किसी सदस्य द्वारा आंतरिक ऋण नहीं चुकाया जाता है तो क्या होता है?", options: ["समूह को नुकसान होता है, जो भुगतान सुनिश्चित करने में साथियों के दबाव और भरोसे के महत्व को उजागर करता है।", "कुछ नहीं, इसे माफ कर दिया जाता है।", "बैंक इसका भुगतान करता है।", "पुलिस तुरंत उसे गिरफ्तार कर लेती है।"], correctOptionIndex: 0 }
        ]
    },

    {
        level: 4, stage: 2, language: 'english', questions: [
            { questionText: "What is SHG-Bank Linkage?", options: ["When a bank builds a new branch.", "Connecting the mature SHG to a formal commercial bank to open group accounts and access larger credit.", "Using an ATM.", "Combining two banks."], correctOptionIndex: 1 },
            { questionText: "Before an SHG can receive a bank loan, what 'test' do banks usually conduct?", options: ["A running race.", "A grading exercise looking at the group's regularity, saving habits, meeting records, and internal repayment history.", "An English test.", "A driving test."], correctOptionIndex: 1 },
            { questionText: "Why do banks trust SHGs with loans?", options: ["Because they use social pressure and joint liability to ensure excellent repayment rates.", "Because they are forced to do so.", "Because the women are rich.", "Because they give their land to the bank."], correctOptionIndex: 0 },
            { questionText: "In SHG-Bank linkage, does the bank loan money to a single woman or the group?", options: ["To the husband.", "The loan is sanctioned to the SHG as a collective entity, who then distributes it internally to members.", "To the poorest single woman.", "To the Gram Panchayat."], correctOptionIndex: 1 },
            { questionText: "What document is absolutely critical when linking an SHG to a bank?", options: ["A passport.", "The Resolution passed by the members authorizing representatives to open and operate the bank account.", "A marriage certificate.", "A property deed."], correctOptionIndex: 1 }
        ]
    },
    {
        level: 4, stage: 2, language: 'hindi', questions: [
            { questionText: "SHG-बैंक लिंकेज (Bank Linkage) क्या है?", options: ["जब बैंक कोई नई शाखा बनाता है।", "परिपक्व (mature) SHG को समूह खाते खोलने और बड़े ऋण (Credit) तक पहुंचने के लिए औपचारिक बैंक से जोड़ना।", "एटीएम का उपयोग करना।", "दो बैंकों को मिलाना।"], correctOptionIndex: 1 },
            { questionText: "SHG को बैंक से ऋण मिलने से पहले, बैंक आमतौर पर कौन सा 'परीक्षण' (Test) करते हैं?", options: ["एक दौड़।", "एक 'ग्रेडिंग' प्रक्रिया जो समूह की नियमितता, बचत की आदतों, बैठक के रिकॉर्ड और पुराने भुगतान इतिहास को देखती है।", "अंग्रेजी की परीक्षा।", "ड्राइविंग टेस्ट।"], correctOptionIndex: 1 },
            { questionText: "बैंक SHGs पर ऋण के साथ भरोसा क्यों करते हैं?", options: ["क्योंकि वे पारस्पारिक सामाजिक दबाव और 'सयुंक्त देयता' (Joint Liability) का उपयोग करते हैं जिससे ऋण वापसी दर बहुत अच्छी होती है।", "क्योंकि उन्हें ऐसा करने के लिए मजबूर किया जाता है।", "क्योंकि महिलाएं अमीर हैं।", "क्योंकि वे अपनी जमीन बैंक को देते हैं।"], correctOptionIndex: 0 },
            { questionText: "SHG-बैंक लिंकेज में, क्या बैंक किसी एकल महिला या समूह को पैसा उधार देता है?", options: ["पति को।", "ऋण (Loan) एक सामूहिक इकाई के रूप में SHG को स्वीकृत (Sanctioned) किया जाता है, जो इसे सदस्यों को वितरित करता है।", "सबसे गरीब एकल महिला को।", "ग्राम पंचायत को।"], correctOptionIndex: 1 },
            { questionText: "SHG को बैंक से जोड़ते समय कौन सा दस्तावेज बिल्कुल महत्वपूर्ण है?", options: ["पासपोर्ट।", "प्रतिनिधियों (Representatives) को बैंक खाता खोलने और संचालित करने के लिए अधिकृत करने वाला 'प्रस्ताव' (Resolution)।", "विवाह प्रमाण पत्र।", "एक संपत्ति डीड।"], correctOptionIndex: 1 }
        ]
    },

    {
        level: 4, stage: 3, language: 'english', questions: [
            { questionText: "What does a 'Collateral-free loan' mean?", options: ["A loan that has no interest.", "A loan granted by the bank without demanding physical assets like land, house, or gold as security.", "A loan that you don't have to repay.", "A loan specifically for buying free trees."], correctOptionIndex: 1 },
            { questionText: "How does an SHG manage to get enormous collateral-free loans from banks?", options: ["By fighting with the manager.", "Through 'Group Guarantee' or 'Joint Liability', where the group's collective discipline acts as the 'collateral'.", "By forging documents.", "By paying bribes."], correctOptionIndex: 1 },
            { questionText: "What is 'Joint Liability'?", options: ["If one member defaults, the entire group is responsible for covering the shortfall, ensuring everyone pressures each other to repay.", "A type of tax.", "A joint bank account for marriage.", "If one member defaults, the bank forgives the loan completely."], correctOptionIndex: 0 },
            { questionText: "What can a woman use an SHG bank loan for?", options: ["Only for throwing parties.", "Income generation (buying livestock, starting a shop), education, or emergency health needs.", "Only for buying jewelry.", "She cannot use it personally."], correctOptionIndex: 1 },
            { questionText: "When an SHG successfully repays its first bank loan, what happens next?", options: ["The bank closes the account.", "The SHG's credit score improves, and the bank will offer an even larger loan amount in the next cycle.", "The members are taxed.", "The group is dissolved."], correctOptionIndex: 1 }
        ]
    },
    {
        level: 4, stage: 3, language: 'hindi', questions: [
            { questionText: "कोलैटरल-मुक्त ऋण (Collateral-free loan) का क्या अर्थ है?", options: ["एक ऋण जिसमें कोई ब्याज नहीं है।", "भूमि, घर या सोने जैसी भौतिक संपत्ति को सुरक्षा (गिरवी) के रूप में मांगे बिना बैंक द्वारा दिया गया ऋण।", "एक ऋण जिसे आपको चुकाना नहीं है।", "एक सरकारी योजना।"], correctOptionIndex: 1 },
            { questionText: "SHG बैंकों से बड़ी संपार्श्विक-मुक्त (बिना गिरवी वाले) ऋण प्राप्त करने का प्रबंधन कैसे करता है?", options: ["मैनेजर से लड़कर।", "'समूह गारंटी' (Group Guarantee) या 'संयुक्त देयता' के माध्यम से, जहाँ समूह का सामूहिक अनुशासन गिरवी के रूप में कार्य करता है।", "फर्जी दस्तावेज बनाकर।", "रिश्वत देकर।"], correctOptionIndex: 1 },
            { questionText: "'संयुक्त देयता' (Joint Liability) क्या है?", options: ["यदि कोई एक सदस्य डिफॉल्ट (Default) करता है, तो कमी को पूरा करने के लिए पूरा समूह जिम्मेदार है, जिससे सभी एक दूसरे पर दबाव बनाते हैं।", "एक प्रकार का कर।", "विवाह के लिए एक संयुक्त बैंक खाता।", "यदि एक सदस्य डिफॉल्ट करता है, तो बैंक ऋण पूरी तरह से माफ कर देता है।"], correctOptionIndex: 0 },
            { questionText: "एक महिला SHG बैंक ऋण का उपयोग किस लिए कर सकती है?", options: ["केवल पार्टी करने के लिए।", "आय सृजन (Income Generation जैसे पशुधन खरीदना, दुकान शुरू करना), शिक्षा, या आपातकालीन स्वास्थ्य आवश्यकताएं।", "केवल गहने खरीदने के लिए।", "वह व्यक्तिगत रूप से इसका उपयोग नहीं कर सकती है।"], correctOptionIndex: 1 },
            { questionText: "जब कोई SHG अपना पहला बैंक ऋण सफलता पूर्वक चुकाता है, तो आगे क्या होता है?", options: ["बैंक खाता बंद कर देता है।", "SHG के क्रेडिट इतिहास में सुधार होता है, और बैंक अगले चक्र में एक बड़ी ऋण राशि (Larger Loan) की पेशकश करेगा।", "सदस्यों पर कर लगाया जाता है।", "समूह भंग कर दिया जाता है।"], correctOptionIndex: 1 }
        ]
    }
];
