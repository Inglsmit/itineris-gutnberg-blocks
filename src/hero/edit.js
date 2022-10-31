import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
	InspectorControls,
	RichText,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { isBlobURL } from '@wordpress/blob';
import {
	Spinner,
	ToolbarButton,
	PanelBody,
	SelectControl,
	TextareaControl,
	withNotices,
} from '@wordpress/components';
import './editor.scss';

function Edit ( { attributes, setAttributes, noticeOperations, noticeUI } ) {
	const { header, description, author, imgID, imgUrl, imgAlt } = attributes;

	const onSelectMedia = ( media ) => {
		if ( !media || !media.url ) {
			setAttributes( {
				imgUrl: undefined,
				imgID: undefined,
				imgAlt: '',
			} );
			return;
		}
		setAttributes( {
			imgUrl: media.url,
			imgID: media.id,
			imgAlt: media.alt,
		} );
	};

	const imageObject = useSelect(
		( select ) => {
			const { getMedia } = select( 'core' );
			return imgID ? getMedia( imgID ) : null;
		},
		[ imgID ]
	);

	const imageSizes = useSelect( ( select ) => {
		return select( blockEditorStore ).getSettings().imageSizes;
	}, [] );

	const getImageSizeOptions = () => {
		if ( !imageObject ) return [];
		const options = [];
		const sizes = imageObject.media_details.sizes;
		for ( const key in sizes ) {
			const size = sizes[ key ];
			const imageSize = imageSizes.find( ( s ) => s.slug === key );
			if ( imageSize ) {
				options.push( {
					label: imageSize.name,
					value: size.source_url,
				} );
			}
		}
		return options;
	};

	const onChangeImageSize = ( val ) => {
		setAttributes( { imgUrl: val } );
	};

	const onChangeImgAlt = ( val ) => {
		setAttributes( { imgAlt: val } );
	};

	const onChangeHeader = ( val ) => {
		setAttributes( { header: val } );
	}

	const onChangeAuthor = ( val ) => {
		setAttributes( { author: val } );
	}

	const onChangeDescripton = ( val ) => {
		setAttributes( { description: val } );
	}

	const removeMedia = () => {
		setAttributes( {
			imgUrl: undefined,
			imgAlt: '',
			imgID: undefined,
		} );
	};

	const onUploadError = ( message ) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Image Settings', 'itinerisblocks' ) }>
					{ imgID && (
						<SelectControl
							label={ __( 'Image Size', 'itinerisblocks' ) }
							options={ getImageSizeOptions() }
							value={ imgUrl }
							onChange={ onChangeImageSize }
						/>
					) }
					{ imgUrl && !isBlobURL( imgUrl ) && (
						<TextareaControl
							label={ __( 'Alt Text', 'itinerisblocks' ) }
							value={ imgAlt }
							onChange={ onChangeImgAlt }
							help={ __(
								"Alternative text describes your image to people can't see it. Add a short description with its key details.",
								'itinerisblocks'
							) }
						/>
					) }
				</PanelBody>
			</InspectorControls>
			{ imgUrl && (
				<BlockControls group="inline">
					<MediaReplaceFlow
						name={ __( 'Replace Media', 'itinerisblocks' ) }
						onSelect={ onSelectMedia }
						// onSelectURL={onSelectURL}
						// eslint-disable-next-line no-console
						onError={ onUploadError }
						accept="image/*"
						allowedTypes={ [ 'image' ] }
						mediaId={ imgID }
						mediaURL={ imgUrl }
					/>
					<ToolbarButton onClick={ removeMedia }>
						{ __( 'Remove Media', 'itinerisblocks' ) }
					</ToolbarButton>
				</BlockControls>
			) }
			<div { ...useBlockProps() } data-align="full">
				<MediaPlaceholder
					icon="admin-users"
					onSelect={ onSelectMedia }
					// eslint-disable-next-line no-console
					onError={ onUploadError }
					accept="image/*"
					allowedTypes={ [ 'image' ] }
					disableMediaButtons={ imgUrl }
					notices={ noticeUI }
				/>
				{ imgUrl && (
					<>
						<div className={ `wp-block-itinerisblocks-hero__media-wrap${ isBlobURL( imgUrl ) ? ' is-loading' : ''
							}` }>
							<div className="wp-block-itinerisblocks-hero__left-col">
							</div>
							<div className="wp-block-itinerisblocks-hero__right-col">
								<img
									className="wp-block-itinerisblocks-hero__img"
									src={ imgUrl }
									alt={ imgAlt }
								/>
								{ isBlobURL( imgUrl ) && <Spinner /> }
							</div>
						</div>

						<div className="wp-block-itinerisblocks-hero__inner-block">
							<div className="wp-block-itinerisblocks-hero__container">
								<div className="wp-block-itinerisblocks-hero__left-col">
									<RichText
										placeholder={ __( 'Header', 'itinerisblocks' ) }
										tagName="h1"
										onChange={ onChangeHeader }
										className="wp-block-itinerisblocks-hero__header"
										value={ header }
										allowedFormats={ [] }
									/>
									<RichText
										placeholder={ __( 'Descripton', 'itinerisblocks' ) }
										tagName="p"
										onChange={ onChangeDescripton }
										className="wp-block-itinerisblocks-hero__descripton"
										value={ description }
										allowedFormats={ [] }
									/>
									<RichText
										placeholder={ __( 'Author', 'itinerisblocks' ) }
										tagName="p"
										onChange={ onChangeAuthor }
										className="wp-block-itinerisblocks-hero__author"
										value={ author }
										allowedFormats={ [] }
									/>
								</div>
								<div className="wp-block-itinerisblocks-hero__right-col"></div>
							</div>
						</div>
					</>
				) }
			</div>
		</>
	);
}

export default withNotices( Edit );
