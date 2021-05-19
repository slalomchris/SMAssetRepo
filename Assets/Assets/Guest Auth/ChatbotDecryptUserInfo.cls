public class ChatbotDecryptUserInfo {
	@InvocableMethod(label='Decrypt User Info')
    public static List<ResponsesOutput> DecryptPassedInInfo(List<ResponsesInput> riList) {
		ResponsesOutput output = new ResponsesOutput();
        List<ResponsesOutput> outputList = new List<ResponsesOutput>();

        //nothing was input, exit method
        if(riList== null || riList.size() == 0) { return null; }

        String eFirstName = (riList[0].EncryptedUserFirstName == null) ? '' : riList[0].EncryptedUserFirstName;
        String eLastName = (riList[0].EncryptedUserLastName == null) ? '' : riList[0].EncryptedUserLastName;
        String eEmail = (riList[0].EncryptedUserEmail == null) ? '' : riList[0].EncryptedUserEmail;

        output.DecryptedUserFirstName = DecryptInfo(eFirstName);
        output.DecryptedUserLastName = DecryptInfo(eLastName);
        output.DecryptedUserEmail = DecryptInfo(eEmail);

        outputList.add(output);

        return outputList;
    }

    private static String DecryptInfo(String encryptedInfo) {
        //Go get the key from SFDC
        Chatbot_Configuration_Setting__mdt decryptionSetting = 
            [SELECT Key__c, Initialization_Vector__c
            FROM Chatbot_Configuration_Setting__mdt 
            WHERE MasterLabel='Decryption Setting'];

        //Decrypt using key and IV
        String key = (decryptionSetting == null || decryptionSetting.Key__c == null) ? '' : decryptionSetting.Key__c;
        String iv = (decryptionSetting == null || decryptionSetting.Initialization_Vector__c == null) ? '' : decryptionSetting.Initialization_Vector__c;     
        Blob ivBlob = EncodingUtil.base64Decode(iv);
        Blob keyBlob = Blob.valueOf(key);
        Blob encryptedInfoBlob = EncodingUtil.base64Decode(encryptedInfo);

        Blob decryptedInfoBlob = Crypto.decrypt('AES256', keyBlob, ivBlob, encryptedInfoBlob);
        String decryptedInfo = decryptedInfoBlob.toString();

        return decryptedInfo;
    }

    public class ResponsesInput {
        @InvocableVariable
        public String EncryptedUserFirstName;
        @InvocableVariable
        public String EncryptedUserLastName;
        @InvocableVariable
        public String EncryptedUserEmail;
    }

    public class ResponsesOutput {
        @InvocableVariable
        public String DecryptedUserFirstName;
        @InvocableVariable
        public String DecryptedUserLastName;
        @InvocableVariable
        public String DecryptedUserEmail;
    }
}