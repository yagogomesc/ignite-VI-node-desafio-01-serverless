import {document} from '../utils/dynamodbClient';
import {v4 as uuid} from 'uuid';

interface ICreateTODO {
    title: string;
    deadline: string;
}

interface ITemplate {
    id: string;
    user_id: string;
    title: string;
    done: boolean;
    deadline: string;
}

export const handler = async (event) => {
    const {userid} = event.pathParameters;
    const {title, deadline} = JSON.parse(event.body) as ICreateTODO;

    const id = uuid();

    const data: ITemplate = {
        id,
        user_id: userid,
        title,
        done: false,
        deadline: new Date(deadline).toISOString()
    };

    await document.put({
        TableName: "todos",
        Item: data
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "TODO Created",
            data
        }),
        headers: {
            "Content-type": "application/json"
        }
    }
}