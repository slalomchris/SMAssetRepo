@isTest
public class ChatbotValidateAuthStatus_Test {
	@isTest
    public static void passAuthenticatedJSON(){
        List<ChatbotValidateAuthStatus.ResponsesInput> riList = new List<ChatbotValidateAuthStatus.ResponsesInput>();
        List<ChatbotValidateAuthStatus.ResponsesOutput> roList = new List<ChatbotValidateAuthStatus.ResponsesOutput>();
        ChatbotValidateAuthStatus.ResponsesInput ri = new ChatbotValidateAuthStatus.ResponsesInput();
        ri.lastCustomerInput = '{"[SIGNIN-STATUS]":{"Success":true,"FirstName":"Chris","LastName":"Hale","Email":"christopher.hale@slalom.com"}}';
        riList.add(ri);

        Test.startTest();
            roList = ChatbotValidateAuthStatus.validateAuthStatus(riList);
        Test.stopTest();

        if(roList.size() > 0) {
            ChatbotValidateAuthStatus.ResponsesOutput ro = roList[0];
            
            System.assertEquals(true, ro.isAuthenticated);
            System.assertEquals(true, ro.isAuthEvent);
            System.assertEquals('Chris', ro.firstName);
            System.assertEquals('Hale', ro.lastName);
            System.assertEquals('christopher.hale@slalom.com', ro.email);
        }
    }
    
    @isTest
    public static void passUnauthenticatedJSON(){
        List<ChatbotValidateAuthStatus.ResponsesInput> riList = new List<ChatbotValidateAuthStatus.ResponsesInput>();
        List<ChatbotValidateAuthStatus.ResponsesOutput> roList = new List<ChatbotValidateAuthStatus.ResponsesOutput>();
        ChatbotValidateAuthStatus.ResponsesInput ri = new ChatbotValidateAuthStatus.ResponsesInput();
        ri.lastCustomerInput = '{"[SIGNIN-STATUS]":{"Success":false,"FirstName":"","LastName":"","Email":""}}';
        riList.add(ri);

        Test.startTest();
            roList = ChatbotValidateAuthStatus.validateAuthStatus(riList);
        Test.stopTest();

        if(roList.size() > 0) {
            ChatbotValidateAuthStatus.ResponsesOutput ro = roList[0];
            
            System.assertEquals(false, ro.isAuthenticated);
            System.assertEquals(true, ro.isAuthEvent);
            System.assertEquals('', ro.firstName);
            System.assertEquals('', ro.lastName);
            System.assertEquals('', ro.email);
        }
    }
    
    @isTest static void passNothing(){
        List<ChatbotValidateAuthStatus.ResponsesInput> riList = new List<ChatbotValidateAuthStatus.ResponsesInput>();
        List<ChatbotValidateAuthStatus.ResponsesOutput> roList = new List<ChatbotValidateAuthStatus.ResponsesOutput>();
        ChatbotValidateAuthStatus.ResponsesInput ri = new ChatbotValidateAuthStatus.ResponsesInput();
        ri.lastCustomerInput = 'Hello';
        riList.add(ri);

        Test.startTest();
            roList = ChatbotValidateAuthStatus.validateAuthStatus(riList);
        Test.stopTest();

        if(roList.size() > 0) {
            ChatbotValidateAuthStatus.ResponsesOutput ro = roList[0];
            
            System.assertEquals(false, ro.isAuthEvent);
        }
    }
}