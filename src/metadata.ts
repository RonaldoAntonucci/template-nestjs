/* eslint-disable */
export default async () => {
    const t = {};
    return {
        '@nestjs/swagger': {
            models: [
                [
                    import('./auth/auth.dto'),
                    {
                        RefreshJwtDto: {
                            token: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./shared/database/database.entity'),
                    {
                        DatabaseEntity: {
                            id: { required: true, type: () => String },
                            createdAt: { required: true, type: () => Date },
                            updatedAt: { required: true, type: () => Date },
                        },
                        SoftDeleteEntity: {
                            deletedAt: { required: true, type: () => Date },
                        },
                    },
                ],
                [
                    import('./shared/dtos/pagination.dto'),
                    {
                        PaginationDto: {
                            skip: {
                                required: false,
                                type: () => Number,
                                default: 0,
                                minimum: 0,
                            },
                            take: {
                                required: false,
                                type: () => Number,
                                default: 20,
                                minimum: 1,
                                maximum: 100,
                            },
                        },
                    },
                ],
            ],
            controllers: [
                [
                    import('./health/health.controller'),
                    { HealthController: { check: { type: Object } } },
                ],
            ],
        },
    };
};
