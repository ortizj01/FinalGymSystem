import { pool } from '../db.js';

// Obtener todas las valoraciones médicas
export const getValoracionesMedicas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ValoracionMedica');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una valoración médica por ID
export const getValoracionMedicaById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM ValoracionMedica WHERE IdValoracion = ?', [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Valoración Médica no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una valoración médica por ID de usuario
export const getValoracionMedicaByUsuarioId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM ValoracionMedica WHERE IdUsuario = ?', [id]);
        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).json({ message: 'Valoración Médica no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nueva valoración médica
export const createValoracionMedica = async (req, res) => {
    try {
        const { IdUsuario, TieneCondicionCronica, CirugiaPrevia, AlergiasConocidas, MedicamentosActuales, LesionesMusculoesqueleticas, EnfermedadCardiacaVascular, AntecedentesFamiliares, TipoAfiliacion, IMC } = req.body;
        const [result] = await pool.query(
            'INSERT INTO ValoracionMedica (IdUsuario, TieneCondicionCronica, CirugiaPrevia, AlergiasConocidas, MedicamentosActuales, LesionesMusculoesqueleticas, EnfermedadCardiacaVascular, AntecedentesFamiliares, TipoAfiliacion, IMC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [IdUsuario, TieneCondicionCronica, CirugiaPrevia, AlergiasConocidas, MedicamentosActuales, LesionesMusculoesqueleticas, EnfermedadCardiacaVascular, AntecedentesFamiliares, TipoAfiliacion, IMC]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una valoración médica por ID
export const updateValoracionMedica = async (req, res) => {
    try {
        const { id } = req.params;
        const { IdUsuario, TieneCondicionCronica, CirugiaPrevia, AlergiasConocidas, MedicamentosActuales, LesionesMusculoesqueleticas, EnfermedadCardiacaVascular, AntecedentesFamiliares, TipoAfiliacion, IMC } = req.body;
        await pool.query(
            'UPDATE ValoracionMedica SET IdUsuario = ?, TieneCondicionCronica = ?, CirugiaPrevia = ?, AlergiasConocidas = ?, MedicamentosActuales = ?, LesionesMusculoesqueleticas = ?, EnfermedadCardiacaVascular = ?, AntecedentesFamiliares = ?, TipoAfiliacion = ?, IMC = ? WHERE IdValoracion = ?',
            [IdUsuario, TieneCondicionCronica, CirugiaPrevia, AlergiasConocidas, MedicamentosActuales, LesionesMusculoesqueleticas, EnfermedadCardiacaVascular, AntecedentesFamiliares, TipoAfiliacion, IMC, id]
        );
        res.json({ message: 'Valoración Médica actualizada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una valoración médica por ID
export const deleteValoracionMedica = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM ValoracionMedica WHERE IdValoracion = ?', [id]);
        res.json({ message: 'Valoración Médica eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
