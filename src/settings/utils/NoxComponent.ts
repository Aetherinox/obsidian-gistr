import { Setting, MomentFormatComponent, DropdownComponent, TextComponent, ToggleComponent, ValueComponent, SliderComponent, TextAreaComponent } from 'obsidian'
import { lng } from 'src/lang/helpers'

/*
	Class to extend obsidian components to include a reset button
	next to each control / component.
*/

export class NoxComponent extends Setting
{

	containerEl: 	HTMLElement
	private name: 	string | DocumentFragment = ''
	private desc: 	string | DocumentFragment = ''

    constructor( containerEl: HTMLElement )
	{
        super( containerEl )
        this.setName( this.name )
        this.setDesc( this.desc )

		return this
    }
	
    public setName( name: string | DocumentFragment ): this
	{
        super.setName( name )
        this.name = name

        return this
    }

    public setDesc( desc: string | DocumentFragment ): this
	{
        super.setDesc( desc )
        this.desc = desc

        return this
    }

	/*
		Textbox
	*/

	public addNoxTextbox
	(
		cb: 		( comp: TextComponent ) => unknown,
		onReset: 	( comp: TextComponent ) => string,
	): this
	{
		return super.addText( ( comp ) =>
		{
			this.addReset( comp, onReset )
			cb( comp )
		} )
	}

	/*
		Textarea
	*/

	public addNoxTextarea
	(
		cb: 		( comp: TextAreaComponent ) => unknown,
		onReset: 	( comp: TextAreaComponent ) => string,
	): this
	{
		return super.addTextArea( ( comp ) =>
		{
			this.addReset( comp, onReset )
			cb( comp )
		} )
	}

	/*
		Toggle Button
	*/

	public addNoxToggle
	(
		cb: 		( comp: ToggleComponent ) => unknown,
		onReset: 	( comp: ToggleComponent ) => boolean,
	): this
	{
		return super.addToggle( ( comp ) =>
		{
			this.addReset( comp, onReset )
			cb( comp )
		} )
	}

	/*
		Dropdown
	*/

	public addNoxDropdown< T extends string = string >
	(
		cb: 		( comp: DropdownComponent ) => unknown,
		onReset: 	( comp: DropdownComponent ) => T,
	): this
	{
		return super.addDropdown( ( comp ) =>
		{
			this.addReset< string, DropdownComponent >( comp, onReset )
			cb( comp )
		} )
	}

	/*
		Slider
	*/

	public addNoxSlider
	(
		cb: 		( comp: SliderComponent ) => unknown,
		onReset: 	( comp: SliderComponent ) => number,
	): this
	{
		return super.addSlider( ( comp ) =>
		{
			this.addReset( comp, onReset )
			cb( comp )
		} )
	}

	/*
		Formatter (e.g.: dates)
	*/

	public addNoxMomentFormat
	(
		cb: 		( comp: MomentFormatComponent ) => unknown,
		onReset: 	( comp: MomentFormatComponent ) => string,
	): this
	{
		return super.addMomentFormat( ( comp ) =>
		{
			this.addReset( comp, onReset )
			cb( comp )
		} )
	}

	/*
		Reset button functionality
	*/

	private addReset< T, V extends ValueComponent< T > >( comp: V, onReset: ( comp: V ) => T ): V
	{
		this.addExtraButton( ( btn ) =>
		{
			btn
				.setIcon( 'reset' )
				.setTooltip( lng( "base_component_reset" ) )
				.onClick( ( ) =>
				{
					comp.setValue( onReset( comp ) )

					if ( comp instanceof MomentFormatComponent )
					{
						comp.onChanged( )
					}
					else if ( comp instanceof DropdownComponent )
					{
						const event = new Event( 'change' )
						comp.selectEl.dispatchEvent( event )
					}
					else if ( comp instanceof TextComponent || comp instanceof TextAreaComponent )
					{
						comp.onChanged( )
					}
				} )
		} )

		return comp
	}
}
