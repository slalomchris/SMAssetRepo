public class ChatbotUtils {
	@InvocableMethod(label='Is Within Business Hours?')
    public static List<ResponsesOutput> IsWithinBusinessHours() {
		ResponsesOutput output = new ResponsesOutput();
        List<ResponsesOutput> outputList = new List<ResponsesOutput>();
        
        //Get Default Business Hours
        BusinessHours bh = [SELECT Id FROM BusinessHours WHERE IsDefault=TRUE];
        //Get time
        DateTime currentDateTime = DateTime.now().addHours(-1);
        //Check that the current user is inside business hours
        Boolean isWithinBH = BusinessHours.isWithin(bh.Id, currentDateTime);

        //Return the answer 
        output.isWithinBusinessHours = isWithinBH;
        outputList.add(output);

        return outputList;
    }   

    public class ResponsesOutput {
        @InvocableVariable(required=false)
        public Boolean isWithinBusinessHours;
    }
}