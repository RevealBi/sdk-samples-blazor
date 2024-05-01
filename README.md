# Using Reveal SDK in a Blazor Server Application
This tutorial will walk you through building a Blazor Server application to enable a self-service BI and Analytics experience in your Blazor app.

## 8 Steps to Dashboards
The following 8 steps will show you how easy it is to enable rich data visualizations and dashboards in your Blazor applications. As Blazor Server is a single project in Visual Studio, we’ll add code for the Server and the Client to get the application up and running.

There is no need to download and install anything to complete this tutorial.  However, you will need a trial license to complete this tutorial.  To get a trial license, go to this URL: 

[https://help.revealbi.io/web/adding-license-key](https://help.revealbi.io/web/adding-license-key)

In Step 4 of this tutorial, you'll add the llicense key that was emailed to you as part of the process you followed after reading the help topic.

### Step 1 - Create a Blazor Server App
Since this is a Blazor Server app, you should create a Blazor Server app with the defaults.  Once completed, follow the steps below to get Reveal running in your app.

### Step 2 - Add Reveal SDK Nuget Package

1 - Right click the Solution, or Project, and select **Manage NuGet Packages** for Solution.

<img width="409" alt="image" src="https://github.com/RevealBi/sdk-samples-blazor/assets/18453092/763805d6-3656-48a7-8d20-75384f670e72">

2 - In the package manager dialog, open the **Browse** tab, select the **nuget.org** package source, and install the Latest Stable **Reveal.Sdk.AspNetCore** NuGet package into the project.

<img width="1104" alt="image" src="https://github.com/RevealBi/sdk-samples-blazor/assets/18453092/7f7aba3d-03df-4e3e-8bc9-309c9dd01034">

### Step 3 - Set Up Folders / Add Dashboards
To test the Reveal SDK client, we ship test dashboards.  Reveal uses a known folder structure to automatically load and save dashboards - if you use a folder named Dashboards in the root of your project, you are not required to write any additional Load / Save code.

1. Create a folder named `Dashboards` in the root of your solution.
2. Download this zip file [https://users.infragistics.com/Reveal/sample-dashboards.zip](https://users.infragistics.com/Reveal/sample-dashboards.zip) and copy the unzipped files to your newly created dashboards folder.

Note that the .RDASH file extension is simply a .ZIP file, renamed to .RDASH.  In this zip file, we store the JSON definition of the dashboard.

### Step 4 - Update Program.cs
In `Program.cs`:

1. Add to the top of the code window:
```c
using Reveal.Sdk;
```

3. Tell your app to use the Reveal SDK with this code, make sure to place it before the `builder.build` statement.
```c
 builder.Services.AddControllers().AddReveal();
```

If you are adding the license key in code, and not using the file system, then you'd modify the above code to include your license key:

```c
builder.Services.AddControllers().AddReveal(builder =>
{
    builder
    .AddSettings(settings =>
    {
        settings.License = "<paste your license key>";
    });
});
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
To enable Reveal client JavaScript dependencies, the `Pages\_layout.cshtml` file needs to be updated. Add the following code before the end of the closing `</Body>` tag.  If you started with a Blazor Server app, you would add this to the index.html file in wwwroot folder.

Note: This has changed in a .NET 8 Blazor Server app. If you are using .NET 8 project templates, the Components\App.razor needs to be updated.

Note that you'll create the revealview.js file in the next step.

```html
<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
<script src="https://unpkg.com/dayjs@1.8.21/dayjs.min.js"></script>
<script src="https://dl.revealbi.io/reveal/libs/1.6.1/infragistics.reveal.js"></script>

<script type="module">
    import "./js/revealview.js";
</script> 
```

### Step 6 - Add Reveal Client Configuration JavaScript 
The Reveal SDK Client uses is configured through the RevealView.  To load the RevealView, you need to add a JavaScript function on the client.  This is also where you would configure any properties that should be enabled when a dashboard renders.

1. Add `js` folder in the ``\wwwroot\` folder
2. In the `js` folder, add a JavaScript file named `revealview.js` with the following code:

 ```js
window.loadRevealView = function (viewId, dashboardName) {
    $.ig.RVDashboard.loadDashboard(dashboardName).then(dashboard => {
        var revealView = new $.ig.RevealView("#" + viewId);
        revealView.dashboard = dashboard;
    });
}
```

If the server exists outside of this application, like a Blazor WASM app, you can use the `setBaseUrl` function in the `loadRevealView` function. Your code would optionally look like this:

```js
window.loadRevealView = function (viewId, dashboardName) {
    $.ig.RevealSdkSettings.setBaseUrl("https://reveal-api.azurewebsites.net/");
    $.ig.RVDashboard.loadDashboard(dashboardName).then(dashboard => {
        var revealView = new $.ig.RevealView("#" + viewId);
        revealView.dashboard = dashboard;
    });
}
```

### Step 7 - Load Dashboards 
In this Blazor application, you are going to load the dashboards into a `<div>` named ` revealView`.  Follow these steps to load the sample dashboards from the `Dashboards` folder in your application.

1. In `Pages\Index.Razor`, add this using statement:

```html
@inject IJSRuntime JSRuntime
```

2. Add the code for the dropdown that you’ll use to selected the dashboard to load:
```html
<select @onchange="selectedDashboardChanged">
    <option>Campaigns</option>
    <option>Manufacturing</option>
    <option>Marketing</option>
    <option>Sales</option>
</select>
```

3. Add the revealView div:
```html
<div id="revealView" style="height: calc(100vh - 30px); width: 100%; position:relative;" ></div>
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

### Step 8 - Run Your Application 
At this point, all the steps are completed to enable powerful BI features in your Blazor application.  Run your application to see the results!
