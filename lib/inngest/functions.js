import {inngest} from './client'

export const helloworld=inngest.createFunction(
    {id:"helloworld", triggers:[{event:"test/hello.world"}]},
    async({event,step})=>{
        await step.sleep("wait-a-moment","1s");
        return {message: `Hello ${event.data.email}!`};
    }
)