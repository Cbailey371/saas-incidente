const { Empresa, Licencia, sequelize } = require('../../models');

exports.listarEmpresas = async (req, res) => {
    try {
        const empresas = await Empresa.findAll({
            order: [['nombre', 'ASC']],
        });
        res.status(200).json({ message: 'Empresas listadas exitosamente.', empresas });
    } catch (error) {
        console.error('Error al listar empresas:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

exports.toggleEmpresaActiva = async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction();
    try {
        const empresa = await Empresa.findByPk(id, { transaction: t });
        if (!empresa) {
            await t.rollback();
            return res.status(404).json({ message: 'Empresa no encontrada.' });
        }

        empresa.activa = !empresa.activa;
        await empresa.save({ transaction: t });

        // Si se desactiva la empresa, marcar todas sus licencias como 'inactiva'
        // Si se activa, marcar las licencias no asignadas como 'disponible'
        const newStatus = empresa.activa ? 'disponible' : 'inactiva';
        const whereCondition = empresa.activa ? { dispositivoId: null } : {};

        await Licencia.update(
            { status: newStatus },
            { where: { empresaId: id, ...whereCondition }, transaction: t }
        );

        await t.commit();
        res.status(200).json({ message: `Empresa ${empresa.activa ? 'activada' : 'desactivada'} exitosamente.` });
    } catch (error) {
        await t.rollback();
        console.error('Error al cambiar estado de la empresa:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};