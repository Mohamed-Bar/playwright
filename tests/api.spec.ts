import {test,expect ,request }from "@playwright/test";

   test('get api', async ({ request }) => {
       await request.get('https://api.restful-api.dev/objects' ).then( async response => {
        const startingtime = Date.now();
         
        
        expect([200, 204]).toContain(response.status());
           const responseBody = JSON.parse(await response.text());
          // expect(responseBody.data.length).toBeGreaterThan(0);
           console.log(responseBody); 
           
           const responseheader = response.headers();
              console.log(responseheader);
            expect(responseBody[0].id).toContain('1');


        const endtime = Date.now();
        const responsetime = endtime - startingtime;
        console.log("Response time is " + responsetime + "ms"); 
       } )
   });



test('post api', async ({ request }) => {
    const startingtime = Date.now();

    const payload = {
        "name": "Apple MacBook Pro 16",
        "data": {
            "year": 2019,
            "price": 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB"
        }
    };

    const response = await request.post('https://api.restful-api.dev/objects', {
        data: payload
    });

    expect([200, 204]).toContain(response.status());
    const responseBody = await response.json();
    console.log(responseBody);

    const endtime = Date.now();
    const responsetime = endtime - startingtime;
    console.log("Response time is " + responsetime + "ms");
});


test('put api', async ({ request }) => {
    // First, create a new object
    const createPayload = {
        "name": "Apple MacBook Pro 16",
        "data": {
            "year": 2019,
            "price": 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB"
        }
    };
    const postResponse = await request.post('https://api.restful-api.dev/objects', { data: createPayload });
    expect(postResponse.status()).toBe(200);
    const postBody = await postResponse.json();
    const newId = postBody.id;

    // Now, update the new object
    const updatePayload = {
        "name": "Apple MacBook Pro 16",
        "data": {
            "year": 2019,
            "price": 2049.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
            "color": "silver"
        }
    };
    const putResponse = await request.put(`https://api.restful-api.dev/objects/${newId}`, { data: updatePayload });
    expect(putResponse.status()).toBe(200);
    const putBody = await putResponse.json();
    expect(putBody.data.price).toBe(2049.99);
    expect(putBody.data.color).toBe("silver");
    console.log(putBody);
});

/*test('delete api', async ({ request }) => {
    const startingtime = Date.now();    
    const response = await request.delete('https://api.restful-api.dev/objects/7');     
    expect(response.status()).toBe(200);
    let responseBody;
    const responseText = await response.text();
    if (responseText) {
        responseBody = JSON.parse(responseText);
        console.log(responseBody);
    } else {
        console.log("No response body returned.");
    }
    const endtime = Date.now();
    const responsetime = endtime - startingtime;
    console.log("Response time is " + responsetime + "ms");
}); */


test('patch api', async ({ request }) => {
    // Create a new object first
    const createPayload = {
        "name": "Apple MacBook Pro 16",
        "data": { "foo": "bar" }
    };
    const postResponse = await request.post('https://api.restful-api.dev/objects', { data: createPayload });
    expect(postResponse.status()).toBe(200);
    const postBody = await postResponse.json();
    const newId = postBody.id;

    // Now PATCH the new object
    const patchPayload = {
        "name": "Apple MacBook Pro 16 (Updated Name)"
    };
    const patchResponse = await request.patch(`https://api.restful-api.dev/objects/${newId}`, { data: patchPayload });
    expect(patchResponse.status()).toBe(200);
    const patchBody = await patchResponse.json();
    expect(patchBody.name).toBe("Apple MacBook Pro 16 (Updated Name)");
    console.log(patchBody);
});



test('delete', async ({ request }) => {
    const response = await request.delete('https://api.restful-api.dev/objects/6');
    let responseBody = await response.json()
    console.log(responseBody);
   // expect(response.status()).toBe(200);
//expect(responseBody.message).toBe('Object with');

}
);


test('delete new object', async ({ request }) => {
    // Create a new object
    const payload = {
        "name": "Test Object",
        "data": { "foo": "bar" }
    };
    const postResponse = await request.post('https://api.restful-api.dev/objects', { data: payload });
    expect(postResponse.status()).toBe(200);
    const postBody = await postResponse.json();
    const newId = postBody.id;

    // Delete the newly created object
    const deleteResponse = await request.delete(`https://api.restful-api.dev/objects/${newId}`);
    expect(deleteResponse.status()).toBe(200);
    const deleteBody = await deleteResponse.json();
    console.log(deleteBody);
});

