import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save ( { attributes } ) {
	const { header, description, author, imgID, imgUrl, imgAlt } = attributes;
	return (
		<div
			{ ...useBlockProps.save( {
				className: `alignfull`,
			} ) }
		>
			{ imgUrl && (
				<>
					<div className="wp-block-itinerisblocks-hero__media-wrap">
						<div className="wp-block-itinerisblocks-hero__left-col">
						</div>
						<div className="wp-block-itinerisblocks-hero__right-col">
							<img
								src={ imgUrl }
								alt={ imgAlt }
								className={
									imgID
										? `wp-block-itinerisblocks-hero__img wp-image-${ imgID }`
										: null
								}
							/>
						</div>
					</div>
					<div className="wp-block-itinerisblocks-hero__inner-block">
						<div className="wp-block-itinerisblocks-hero__container">
							<div className="wp-block-itinerisblocks-hero__left-col">
								<RichText.Content
									tagName="h1"
									className="wp-block-itinerisblocks-hero__header"
									value={ header }
								/>
								<RichText.Content
									tagName="p"
									className="wp-block-itinerisblocks-hero__descripton"
									value={ description }
								/>
								<RichText.Content
									tagName="p"
									className="wp-block-itinerisblocks-hero__author"
									value={ author }
								/>
							</div>
							<div className="wp-block-itinerisblocks-hero__right-col"></div>
						</div>
					</div>
				</>
			) }
		</div>
	);
}
