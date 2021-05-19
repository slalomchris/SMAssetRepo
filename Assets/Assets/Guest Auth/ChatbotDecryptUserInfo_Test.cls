@isTest
public class ChatbotDecryptUserInfo_Test {
	@isTest
    public static void DecryptUserInfo() { 
        //Setup data
        List<ChatbotDecryptUserInfo.ResponsesInput> riList = new List<ChatbotDecryptUserInfo.ResponsesInput>();
        ChatbotDecryptUserInfo.ResponsesInput ri = new ChatbotDecryptUserInfo.ResponsesInput();
        ri.EncryptedUserFirstName = 'vaKMiit9n1yD+5+tQSGcUg==';
        ri.EncryptedUserLastName = '0i47EMEDP6s0x3dYp4Mf9g==';
        ri.EncryptedUserEmail = 'xw2LoHqgKhy2p6It0NXxc1UZq/a+A+Z2Co2jwd0i9GU=';

        riList.add(ri);

        Test.startTest();
            List<ChatbotDecryptUserInfo.ResponsesOutput> roList = ChatbotDecryptUserInfo.DecryptPassedInInfo(riList);
        Test.stopTest();

        if(roList == null) {
            System.assert(false);
        } else {
            System.assertEquals('Test', roList[0].DecryptedUserFirstName);
            System.assertEquals('Testerson', roList[0].DecryptedUserLastName);
            System.assertEquals('allhalechristopher@gmail.com', roList[0].DecryptedUserEmail);
        }
    }
}