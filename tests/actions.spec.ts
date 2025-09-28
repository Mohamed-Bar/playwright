import { expect ,test} from "@playwright/test";


test('text box', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    await page.locator('id=username').fill('tomsmith');
    await page.locator('id=password').pressSequentially('SuperSecretPassword!',{delay:200});     
    await page.locator('id=password').press('Enter');
   // await page.locator('xpath=//*[@id="login"]/button').click();
    //await expect(page.locator('xpath=//*[@id="flash"]')).toContainText('You logged into a secure area!');
    await page.close();
}   );

test('click', async ({ page }) => {
    await page.goto('https://play1.automationcamp.ir/mouse_events.html');
    await page.locator('#click_area').click();
    await expect(page.locator('#click_type')).toHaveText('Click');

    await page.locator('#click_area').dblclick();
    await expect(page.locator('#click_type')).toHaveText('Double-Click');

    await page.locator('#click_area').click({ button: "right" });  
    await expect(page.locator('#click_type')).toHaveText('Right-Click');

    await page.close();
});

test('radio button', async ({ page }) => {
    await page.goto('http://test.rubywatir.com/radios.php');
    await page.locator('[ class="radioclass"]').check();
    await expect(page.locator('[ id="radioId"]')).not.toBeChecked();
    await page.locator('[ id="radioId"]').check();
    await expect(page.locator('[ id="radioId"]')).toBeChecked();
   
    await page.close();
});

test('check box', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/checkboxes');
    await page.locator('(//*[@type="checkbox"])[1]').uncheck();
    await expect(page.locator('(//*[@type="checkbox"])[1]')).not.toBeChecked();
    await page.locator('(//*[@type="checkbox"])[2]').check();
    await expect(page.locator('(//*[@type="checkbox"])[2]').isChecked).toBeTruthy();   
    await page.close();
});

test('dropdownlist', async ({ page }) => { 
    await page.goto('https://the-internet.herokuapp.com/dropdown');
    await page.selectOption('[id="dropdown"]',{
        value: "1"} 
        );
        await page.pause();
        await page.selectOption('[id="dropdown"]', 
        {
        label: "Option 2"} 
        );
        await page.pause();
        await page.selectOption('[id="dropdown"]', 
        {
        index: 2} 
        );

    await page.close();
});

/*test('multi select', async ({ page }) => {
    await page.goto('https://admirhodzic.github.io/multiselect-dropdown/demo.html');
    await page.selectOption('[class="multiselect-dropdown-list-wrapper"]',[
        {label: "Alfa Romeo"},
    await page.pause(),
        {label: "Aston Martin"},
        
    ]);
    await page.close();
});
 */

test('multi select', async ({ page }) => {
    await page.goto('https://admirhodzic.github.io/multiselect-dropdown/demo.html');

    // Open the second dropdown
 const secondDropdown = page.locator('.multiselect-dropdown').nth(1);
 await secondDropdown.selectOption({ label: "Alfa Romeo" });
    await page.pause();     
    await secondDropdown.selectOption({ label: "Aston Martin" });
    await page.pause();
    await page.close();
}   );

test('dynamic list', async ({ page }) => {
    await page.goto('https://demo.automationtesting.in/Register.html');
    await page.locator('[role="combobox"]').click();
    await page.locator('//li[text()="India"]').click();
   //await page.locator('li:has-text("India")').click();
    await page.pause(); 
    await page.close();
}   );

test('alerts', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    await page.locator('[onclick="jsAlert()"]').click();
    await expect (page.locator('[id="result"]')).toHaveText('You successfully clicked an alert');
    await page.pause();

    await page.close();
}   );
test('alerts2', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    page.on('dialog', async(alert)=>{
        const alertText = alert.message();
        expect(alertText).toEqual('I am a JS Alert');  
        await alert.accept();
        
       await expect (page.locator('[id="result"]')).toHaveText('You successfully clicked an alert');

    }   )
    
    await page.locator('[onclick="jsAlert()"]').click();
    await page.pause();``
    await page.close();
}   );
test('alerts3', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    page.on('dialog', async(alert)=>{
        const alertText = alert.message();
        expect(alertText).toEqual('I am a JS Confirm');  
        await alert.accept();
        
       await expect (page.locator('[id="result"]')).toHaveText('You clicked: Ok');

    }   )
    
    await page.locator('[onclick="jsConfirm()"]').click();
    await page.pause();``
    await page.close();
}   );  
    
/*
    //await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    page.reload();
    page.on('dialog', async(alert)=>{
        const alertText = alert.message();
        expect(alertText).toEqual('I am a JS Confirm');  
        await alert.dismiss();   
       await expect (page.locator('[id="result"]')).toHaveText('You You clicked: Cancel');
    }   )
    
    await page.locator('[onclick="jsConfirm()"]').click();
    await page.pause();``
    await page.close();
}   );*/

test.only('alerts prompt', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    page.on('dialog', async(alert)=>{
        const alertText = alert.message();
        expect(alertText).toEqual('I am a JS prompt');  
        await alert.accept('mohamed');   
       await expect (page.locator('[id="result"]')).toHaveText('You entered: mohamed');
    }   )
    
    await page.locator('[onclick="jsPrompt()"]').click();
    await page.pause();``
    await page.close();
}  
  );
    
test('fram', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/nested_frames');
    let framecount= page.frames ().length;
    console.log('the frame count is :'+framecount);
    const frame= page.frame({name:'frame-bottom'});
    console.log('the frame name is :'+frame?.name());

    let bottomframe = page.frameLocator('[src="/frame_bottom"]').locator('//body[contains (text(),"BOTTOM")]');
   await expect (bottomframe).toHaveText('BOTTOM') ; //await frame?.locator('body').click();
    //await frame?.locator('body').fill('BOTTOM');
    //await page.pause();
   
    //await  expect (page.locator('//body[contains (text(),"BOTTOM")]')..toHaveText('BOTTOM'));
  let topframe = page.frame({ name: 'frame-top' });
  let topframechilds = topframe?.childFrames() || [];
  console.log('the top frame child count is :' + topframechilds.length);
  let middleframe = topframechilds.find(f => f.name() === 'frame-middle');
  console.log('the middle frame name is :' + middleframe?.name());
  await expect(middleframe?.locator('#content')).toHaveText('MIDDLE');
  await page.pause();
  await page.close();

}   );
 
test('window tabs', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/windows');
    
    const [browserTabs] = await Promise.all([  
        page.waitForEvent('popup'),
        page.locator('[href="/windows/new"]').click()  
    ]);
    await browserTabs.waitForLoadState();
    const pages = browserTabs.context().pages();
    const defulttab = pages[0];
    await expect(defulttab.locator('//h3')).toHaveText('Opening a new window');
    const latesttab = pages[pages.length - 1];
    await expect(latesttab.locator('//h3')).toHaveText('New Window');
    await page.pause();
    defulttab.close();
    latesttab.close();  
    await page.close();
}
    );


test('sepearte tab ', async ({ page }) => {
    await page.goto('https://demo.automationtesting.in/Windows.html');  
    await page.locator('//a[text()="Open New Seperate Windows"]').click();
    const [newTab] = await Promise.all([  
       page .context() .waitForEvent('page'),
        page.locator('[onclick="newwindow()"]').click() 
    ]);

    await newTab.waitForLoadState();
    await newTab.locator('[href="/downloads"]').click();
    await expect(newTab.locator('[class="d-1"]')).toHaveText('Downloads');
    
    await page.locator('//a[text()="Open New Seperate Windows"]').click();
    
    await page.pause();
    newTab.close();
    await page.close();
}    );

test('drag and drop', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/drag_and_drop');
    const boxA = page.locator('[id="column-a"]');
    const boxB = page.locator('[id="column-b"]');

    await boxA.hover();
    await page.mouse.down();
    await boxB.hover();
    await page.mouse.up();
    await page .pause();


    await boxB.dragTo(boxA);
    await page.pause();
    await page.close();
}
    );


test('download', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/download');
    const [download] = await Promise.all([  
        page.waitForEvent('download'),
        page.locator('[href="download/testfile.txt"]').click()  
    ]);     
    const path = await download.path();
    console.log(path);

    await expect(download.suggestedFilename()).toBe('testfile.txt');
    await download.saveAs('C:\\Users\\Lenovo\\Downloads\\sampleFile.txt');
    await page.pause();
    
    await page.close();
}    );

test('upload', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/upload');
    await page.locator('[id="file-upload"]').setInputFiles('C:\\Users\\Lenovo\\Downloads\\sampleFile.txt');
    await page.locator('[id="file-submit"]').click();
    await expect(page.locator('//h3')).toHaveText('File Uploaded!');
    await page.pause();
    await page.close();
}   );

