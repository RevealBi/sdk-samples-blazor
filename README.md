# Using Reveal SDK in a Blazor Server Application
This tutorial will enable the Reveal SDK in a Blazor Server application.  For a video tutorial, to go to ….
## 8 Steps to Dashboards
The following 8 steps will show you how easy it is to get started with enabling rich data visualizations and dashboards in your Blazor application. There are both client and server configuration that needs to happen.  As Blazor Server is a single project in Visual Studio, we’ll add code to both to get the application up and running.

### Step 1 - Download & Install the Reveal SDK
To set up the Reveal SDK server in your Blazor Server app, you first have to download and install the Reveal SDK installer from the Reveal website.

Follow the step-by-step at this URL to get started: [https://help.revealbi.io/en/web/installation.html](https://help.revealbi.io/en/web/installation.html)

### Step 2 - Create a Blazor Server App
Since this is a Blazor Server app, you should create a Blazor Server app with the defaults.  Once completed, follow the steps below to get Reveal running in your app.

### Step 3 - Set Up Folders / Add Dashboards
To test the Reveal SDK client, we ship test dashboards.  Reveal uses a known folder structure to automatically load and save dashboards - if you use a folder named Dashboards in the root of your project, you are not required to write any additional Load / Save code.

1. Create a folder named `Dashboards`
2. Copy the sample dashboards (Marketing, Sales, Campaigns, Manufacturing) to that folder from one of these locations:
	1. `%public documents%\Infragistics\Reveal\SDK\Web\Sample\Reveal.Sdk.Samples.Web.UpMedia\Dashboards`
	2. [https://users.infragistics.com/Reveal/sample-dashboards.zip](https://users.infragistics.com/Reveal/sample-dashboards.zip)

### Step 4 - Update Program.cs
In `Program.cs`:
1. Add to the top of the code window:
	```
	using Reveal.Sdk;
	```
3. Tell your app to use the Reveal SDK with this code, make sure to place it before the `builder.build` statement.
	```
	 builder.Services.AddControllers().AddReveal();
	```
5. Add the following for correct routing before the `app.run` at the bottom of the `Program.cs`
	```c
	// Required for Reveal
	app.UseEndpoints(endpoints =>
	{
	    endpoints.MapControllerRoute(
	    name: "default",
	    pattern: "{controller=Home}/{action=Index}/{id?}");
	});
	```

### Step 5 - Add Client SDK Dependencies
To enable Reveal client JavaScript dependencies, the `Pages\_layout.cshtml` file needs to be updated. Add the following code before the end of the closing `</Body>` tag.

```html
<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
<script src="https://unpkg.com/dayjs@1.8.21/dayjs.min.js"></script>
<script src="reveal/infragistics.reveal.js"></script>

<script type="module">
    import "./js/revealview.js";
</script> 
```

### Step 6 - Add the Reveal Client SDK Files
The Reveal client SDK consists of a single JavaScript library, with support files like TypeScript definitions and localized language files.  To enable your client application with Reveal, follow these 2 steps.

1. Add a new `reveal` folder in the `wwwroot` folder
2. Copy  `infragistics.reveal.js` from the %public documents%\Infragistics\Reveal\SDK\Web\JS\Client folder  to your newly created `reveal` folder.
### Step 7 - Add Reveal Client Configuration JavaScript 
The Reveal SDK Client uses is configured through the RevealView.  To load the RevealView, you need to add a JavaScript function on the client.  This is also where you would configure any properties that should be enabled when a dashboard renders.

1. Add `js` folder in the ``\wwwroot\` folder
	``2. In the `js` folder, add a JavaScript file named `revealview.js` with the following code:
	```js
	window.loadRevealView = function (viewId, dashboardName) {
	    $.ig.RevealSdkSettings.ensureFontsLoadedAsync().then(

	        $.ig.RVDashboard.loadDashboard(dashboardName, (dashboard) => {
	            console.log(dashboard);
	            var revealView = new $.ig.RevealView("#" + viewId);
	            revealView.dashboard = dashboard;
	        })
	    );
	}
	```

If you are not implementing your own server, or the server exists outside of this application, you can use the `setBaseUrl` function in the `loadRevealView` function. Your code would optionally look like this:

```js
window.loadRevealView = function (viewId, dashboardName) {
	$.ig.RevealSdkSettings.setBaseUrl('https://samples.revealbi.io/upmedia-backend/reveal-api/');    
	
	$.ig.RevealSdkSettings.ensureFontsLoadedAsync().then(
        	$.ig.RVDashboard.loadDashboard(dashboardName, (dashboard) => {
            	console.log(dashboard);
            	var revealView = new $.ig.RevealView("#" + viewId);
            	revealView.dashboard = dashboard;
        })
    );
}
```

### Step 8 - Load Dashboards 
In this Blazor application, you are going to load the dashboards into a `<div>` named ` revealView`.  Follow these steps to load the sample dashboards from the `Dashboards` folder in your application.

1. In `Pages\Index.Razor`, add this using statement:

	```html
	@inject IJSRuntime JSRuntime
	```

2. Add the code for the dropdown that you’ll use to selected the dashboard to load:
	```html
	<select @onchange="selectedDashboardChanged">
	    <option>Campaigns</option>
	    <option>Healthcare</option>
	    <option>Manufacturing</option>
	    <option>Marketing</option>
	    <option>Sales</option>
	</select>
	```

3. Add the revealView div:
	```html
	<div id="revealView" style="width:100%; height:750px"></div>
	```

4. Add code that loads the Campaigns dashboard on first load
	```c
	@code {
	    protected override async Task OnAfterRenderAsync(bool firstRender)
	    {
	        if (firstRender)
	        {
	            await JSRuntime.InvokeVoidAsync("loadRevealView", "revealView", "Campaigns");
	        }
	    }
	```

5. Watch for changes in the Select to load the correct dashboard:
	```c
	async void selectedDashboardChanged(ChangeEventArgs e)
	    {
	        await JSRuntime.InvokeVoidAsync("loadRevealView", "revealView", e.Value!.ToString());
	    }
	}
	```

### Step 9 - Run Your Application 
At this point, all the steps are completed to enable powerful BI features in your Blazor application.  Run your application to see the results!
