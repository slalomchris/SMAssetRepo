public class ChatbotValidateAuthStatus {
    static final String AUTH_MESSAGE_SUB = '[SIGNIN-STATUS]';
    
    @InvocableMethod(label='Check Authentication Status')
    public static List<ResponsesOutput> validateAuthStatus(List<ResponsesInput> responsesInput) {
        ResponsesOutput output = new ResponsesOutput();
        List<ResponsesOutput> outputList = new List<ResponsesOutput>();
        
        //Get last customer input
        String lastInput = responsesInput[0].lastCustomerInput;
        lastInput = lastInput.replace('\'', '');
        system.debug('Input: ' + lastInput);
        //Check to see if message came from auto authentication event
        if(lastInput.contains(AUTH_MESSAGE_SUB)){
            //Deserialize message from site
            Object result = JSON.deserializeUntyped(lastInput);

            if (result instanceof Map<String, Object>) {
                Map<String, Object> resultMap = (Map<String, Object>)result;
                Map<String, Object> data = (Map<String, Object>)resultMap.get(AUTH_MESSAGE_SUB);
                output.isAuthenticated = (Boolean)data.get('Success');                
                if (output.isAuthenticated == true) {
                    output.firstName = (String)data.get('FirstName');
                    output.lastName = (String)data.get('LastName');
                    output.email = (String)data.get('Email');
                    output.isAuthEvent = true;
                } else {
                    output.firstName = '';
                    output.lastName = '';
                    output.email = '';
                    output.isAuthEvent = true;
                }
            }
        } else {
            output.isAuthEvent = false;
        }

        outputList.add(output);

        return outputList;
    }
    
    
    public class ResponsesInput {
        @InvocableVariable(required=true)
        public String lastCustomerInput;
    }

    public class ResponsesOutput {
        @InvocableVariable(required=false)
        public Boolean isAuthenticated;
        @InvocableVariable(required=false)
        public String firstName;
        @InvocableVariable(required=false)
        public String lastName;
        @InvocableVariable(required=false)
        public String email;
        @InvocableVariable(required=false)
        public Boolean isAuthEvent;
    }
}