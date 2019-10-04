// 콤보박스(셀렉트+인풋) 생성
(function($){
	$.widget("ui.combobox", {
		_create: function() {
			this.wrapper = $("<span>").addClass("ui-combobox").insertAfter(this.element);
			this.element.hide();
			this._createAutocomplete();
			this._createShowAllButton();
		},

		_createAutocomplete: function() {
			var selected = this.element.children(":selected"),
			value = selected.val() ? selected.text() : "";
			this.input = $("<input>")
				.appendTo(this.wrapper)
				.val(value)
				.attr("title","")
				.addClass("ui-widget ui-widget-content ui-corner-left ui-combobox-input ui-state-default")	// 흰색: ui-state-default
				.autocomplete({
					delay: 0,
					minLength: 0,
					source: $.proxy(this, "_source")
				});
			this._on(this.input, {
				autocompleteselect: function(event, ui) {
					ui.item.option.selected = true;
					this._trigger("select", event, {
						item: ui.item.option
					});
				},
				autocompletechange: "_removeIfInvalid"
			});

			// input text to html
			/*this.input.data("ui-autocomplete")._renderItem = function(ul, item) {
				return $("<li>").append($("<span>").html(item.label)).appendTo(ul);
			};*/
		},

		_createShowAllButton: function() {
			var input = this.input,
			wasOpen = false;

			$("<a>").attr("tabIndex", -1).appendTo(this.wrapper).button({
					icons: {
						primary: "ui-icon-triangle-1-s"
					},
					text: false
				}).removeClass("ui-corner-all").addClass("ui-combobox-button ui-corner-right").on("click", function() {
					input.trigger("focus");
					if(wasOpen) {	// Close if already visible
						return;
					}
					// 모든 결과 표시
					input.autocomplete("search", "");
				});
		},

		_source: function(request, response) {
			var element = this.element;
			var minLength = element.data('min-length')? element.data('min-length') : 0;
			var term = this.wrapper.children().val();
			if(term.length >= minLength) {
				var matcher = new RegExp(term, "i");
				response(this.element.children("option").map(function() {
					var text = $(this).text();
					if(this.value && (!term || matcher.test(text))) {
						// 진하게
						/*if(request.term) {
							var regex = new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(request.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi");
							text = text.replace(regex, "<strong>$1</strong>");
						}*/
						return {
							label: text,
							value: text,
							option: this
						};
					}
				}));
			}
		},

		_removeIfInvalid: function(event, ui) {
			// Selected an item, nothing to do
			if(ui.item) {
				return;
			}
			// Search for a match(case-insensitive)
			var value = this.input.val(),
			valueLowerCase = value.toLowerCase(),
			valid = false;
			this.element.children("option").each(function() {
				if($(this).text().toLowerCase() === valueLowerCase) {
					this.selected = valid = true;
					return false;
				}
			});
			// Found a match, nothing to do
			if(valid) {
				return;
			}
			// Remove invalid value
			this.element.val("");
			this.input.autocomplete("instance").term = "";
		},

		_destroy: function() {
			this.wrapper.remove();
			this.element.show();
		}
	});
})(jQuery);

$('.combo').combobox();