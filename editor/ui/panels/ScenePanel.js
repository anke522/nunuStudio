 function ScenePanel(parent)
{
	Panel.call(this, parent);

	//Self pointer
	var self = this;

	this.form = new Form(this.element);
	this.form.position.set(5, 10);
	this.form.spacing.set(5, 5);

	//Name
	this.form.addText("Name");
	this.name = new Textbox(this.form.element);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.name = self.name.getText();
			Editor.updateObjectViews();
		}
	});
	this.form.add(this.name);
	this.form.nextRow();

	//Select scene as default
	this.default = new Checkbox(this.form.element);
	this.default.setText("Default scene");
	this.default.size.set(200, 15);
	this.default.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var program = self.obj.parent;
			if(self.default.getValue())
			{
				program.initial_scene = self.obj.uuid;
			}
			else
			{
				program.initial_scene = null;
			}
		}
	});
	this.form.add(this.default);
	this.form.nextRow();

	//Background color
	this.form.addText("Background");
	this.background = new ColorChooser(this.form.element);
	this.background.size.set(80, 18);
	this.background.setOnChange(function()
	{
		if(self.obj !== null)
		{	
			if(self.obj.background === null)
			{
				self.obj.background = new THREE.Color();
			}
			self.obj.background = self.background.getValueHex();
			self.obj.updateFog();
		}
	});
	this.form.add(this.background);
	this.form.nextRow();

	//Fog
	this.form.addText("Fog");
	this.fog = new DropdownList(this.form.element);
	this.fog.size.set(100, 18);
	this.fog.addValue("Off", 0);
	this.fog.addValue("Linear", 1);
	this.fog.addValue("Exponential", 2);
	this.fog.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.setFogMode(self.fog.getSelectedIndex());
			self.updateElementsVisibility();
		}
	});
	this.form.add(this.fog);
	this.form.nextRow();

	//Fog color
	this.fog_color_text = this.form.addText("Color");
	this.fog_color = new ColorChooser(this.form.element);
	this.fog_color.size.set(80, 18);
	this.fog_color.setOnChange(function()
	{
		if(self.obj !== null)
		{		
			self.obj.fog_color = self.fog_color.getValueHex();
			self.obj.updateFog();
		}
	});
	this.form.add(this.fog_color);
	this.form.nextRow();

	//Linear fog near
	this.fog_near_text = this.form.addText("Near");
	this.fog_near = new Numberbox(this.form.element);
	this.fog_near.size.set(60, 18);
	this.fog_near.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.fog_near = self.fog_near.getValue();
			self.obj.updateFog();
		}
	});
	this.form.add(this.fog_near);
	this.form.nextRow();

	//Exponential fog density
	this.fog_density_text = this.form.addText("Density")
	this.fog_density = new Numberbox(this.form.element);
	this.fog_density.size.set(100, 18);
	this.fog_density.setStep(0.0001);
	this.fog_density.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.fog_density = self.fog_density.getValue();
			self.obj.updateFog();
		}
	});
	this.form.add(this.fog_density);
	this.form.nextRow();

	//Linear fog far
	this.fog_far_text = this.form.addText("Far");
	this.fog_far = new Numberbox(this.form.element);
	this.fog_far.size.set(60, 18);
	this.fog_far.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.fog_far = self.fog_far.getValue();
			self.obj.updateFog();
		}
	});
	this.form.add(this.fog_far);
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

//Functions Prototype
ScenePanel.prototype = Object.create(Panel.prototype);
ScenePanel.prototype.attachObject = attachObject;
ScenePanel.prototype.updatePanel = updatePanel;
ScenePanel.prototype.updateElementsVisibility = updateElementsVisibility;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.default.setValue(this.obj.uuid === this.obj.parent.initial_scene);

		if(this.obj.fog instanceof THREE.Fog)
		{
			this.fog.setSelectedIndex(Scene.FOG_LINEAR);
		}
		else if(this.obj.fog instanceof THREE.FogExp2)
		{
			this.fog.setSelectedIndex(Scene.FOG_EXPONENTIAL);
		}
		else
		{
			this.fog.setSelectedIndex(Scene.FOG_NONE);
		}
		this.fog_color.setValueHex(this.obj.fog_color);
		this.fog_near.setValue(this.obj.fog_near);
		this.fog_far.setValue(this.obj.fog_far);
		this.fog_density.setValue(this.obj.fog_density);

		this.updateElementsVisibility();
	}
}

//Update wich elements should be visible
function updateElementsVisibility()
{
	if(this.obj.fog !== null)
	{
		this.fog_color_text.visible = true;
		this.fog_color.visible = true;
		if(this.obj.fog instanceof THREE.Fog)
		{
			this.fog_near_text.visible = true;
			this.fog_near.visible = true;
			this.fog_far_text.visible = true;
			this.fog_far.visible = true;
			this.fog_density_text.visible = false;
			this.fog_density.visible = false;
		}
		else if(this.obj.fog instanceof THREE.FogExp2)
		{
			this.fog_near_text.visible = false;
			this.fog_near.visible = false;
			this.fog_far_text.visible = false;
			this.fog_far.visible = false;
			this.fog_density_text.visible = true;
			this.fog_density.visible = true;
		}
	}
	else
	{
		this.fog_color_text.visible = false;
		this.fog_color.visible = false;
		this.fog_near_text.visible = false;
		this.fog_near.visible = false;
		this.fog_far_text.visible = false;
		this.fog_far.visible = false;
		this.fog_density_text.visible = false;
		this.fog_density.visible = false;
	}

	this.fog_color_text.updateInterface();
	this.fog_color.updateInterface();
	this.fog_near_text.updateInterface();
	this.fog_near.updateInterface();
	this.fog_far_text.updateInterface();
	this.fog_far.updateInterface();
	this.fog_density_text.updateInterface();
	this.fog_density.updateInterface();
}

//Attach object to panel
function attachObject(obj)
{
	this.obj = obj;
	this.updatePanel();
	this.updateInterface();
}
