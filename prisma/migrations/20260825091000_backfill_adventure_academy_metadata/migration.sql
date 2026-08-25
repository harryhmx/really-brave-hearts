-- Bring the existing Adventure Academy record onto the slug-based Project route.
UPDATE "Project" AS project
SET
    "slug" = 'adventure-academy',
    "contentModel" = 'story',
    "imageUrl" = COALESCE(
        "imageUrl",
        'https://hhzzwclcilysoncpspft.supabase.co/storage/v1/object/public/home-assets/images/aa-field-challenge.png'
    ),
    "creatorId" = COALESCE(creator.id, "creatorId")
FROM "User" AS creator
WHERE lower(project.title) LIKE '%adventure academy%'
  AND creator.username = 'ricardo_cortes';
