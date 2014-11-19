(function( $, window, undefined ) {
	$.widget( "mobile.listview", $.mobile.listview, {
		options: {
			childPages: true,
			page: "<div data-role='page'></div>",
			header: '<div data-role="header"><a data-role="button" data-rel="back" data-icon="left" class="ui-btn-left ui-alt-icon ui-nodisc-icon ui-btn ui-icon-carat-l ui-btn-icon-notext ui-corner-all"></a><h1></h1></div>',
			content: "<div class='ui-content'></div>"
		},
		_create: function(){
			this._super();
			if( this.options.childPages ) {
				this._setupChildren();
			}
		},
		_setupChildren: function() {
			this._attachBindings();
			this.element.find( "ul" )
				.css( "display","none" )
				.parent()
				.addClass("ui-btn ui-btn-icon-right ui-icon-carat-r")
				.on('touchstart', function(e){
					$(this).addClass('ui-btn-active');
				})
				.on('touchend', function(e){
					$(this).removeClass('ui-btn-active');
				});
		},
		_attachBindings: function() {
			this._on({
				"click": "_handleSubpageClick"
			});
			this._on( "body", {
				"pagechange": function(){
					if ( this.opening === true ) {
						this.open = true;
						this.opening = false;
					} else if ( this.open === true ) {
						//this.newPage.remove();
						this.open = false;
					}
				}
			});
		
		},
		_handleSubpageClick: function( event ) {
			if( $(event.target).closest( "li" ).children( "ul" ).length == 0 ) {
				return;
			}
			this.opening = true;
			this.newPage = $( this.options.page ).uniqueId();
			this.nestedList  = $( event.target ).children( "ul" )
				.clone().attr( "data-" + $.mobile.ns + "role", "listview" )
				.css( "display", "block" );
			this.pageName = (
				$( event.target.childNodes[0] ).text().replace(/^\s+|\s+$/g, '').length > 0 )?
				$( event.target.childNodes[0] ).text() : $( event.target.childNodes[1] ).text();
			this.pageID = this.newPage.attr( "id" );

			// Build new page
			this.newPage.append(
				$( this.options.header ).find( "h1" ).text( this.pageName ).end()
			).append(
				$( this.options.content )
			).find( "div.ui-content" ).append( this.nestedList );

			$( "body" ).append( this.newPage );

			$( "body" ).pagecontainer( "change", "#" + this.pageID );
		}
	});
})( jQuery, this );
