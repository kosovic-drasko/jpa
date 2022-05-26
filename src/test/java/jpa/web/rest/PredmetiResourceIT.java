package jpa.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import jpa.IntegrationTest;
import jpa.domain.Predmeti;
import jpa.repository.PredmetiRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PredmetiResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PredmetiResourceIT {

    private static final String DEFAULT_NAZIV_PREDMETA = "AAAAAAAAAA";
    private static final String UPDATED_NAZIV_PREDMETA = "BBBBBBBBBB";

    private static final Integer DEFAULT_BROJ_SEMESTARA = 1;
    private static final Integer UPDATED_BROJ_SEMESTARA = 2;

    private static final String ENTITY_API_URL = "/api/predmetis";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PredmetiRepository predmetiRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPredmetiMockMvc;

    private Predmeti predmeti;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Predmeti createEntity(EntityManager em) {
        Predmeti predmeti = new Predmeti().nazivPredmeta(DEFAULT_NAZIV_PREDMETA).brojSemestara(DEFAULT_BROJ_SEMESTARA);
        return predmeti;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Predmeti createUpdatedEntity(EntityManager em) {
        Predmeti predmeti = new Predmeti().nazivPredmeta(UPDATED_NAZIV_PREDMETA).brojSemestara(UPDATED_BROJ_SEMESTARA);
        return predmeti;
    }

    @BeforeEach
    public void initTest() {
        predmeti = createEntity(em);
    }

    @Test
    @Transactional
    void createPredmeti() throws Exception {
        int databaseSizeBeforeCreate = predmetiRepository.findAll().size();
        // Create the Predmeti
        restPredmetiMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(predmeti)))
            .andExpect(status().isCreated());

        // Validate the Predmeti in the database
        List<Predmeti> predmetiList = predmetiRepository.findAll();
        assertThat(predmetiList).hasSize(databaseSizeBeforeCreate + 1);
        Predmeti testPredmeti = predmetiList.get(predmetiList.size() - 1);
        assertThat(testPredmeti.getNazivPredmeta()).isEqualTo(DEFAULT_NAZIV_PREDMETA);
        assertThat(testPredmeti.getBrojSemestara()).isEqualTo(DEFAULT_BROJ_SEMESTARA);
    }

    @Test
    @Transactional
    void createPredmetiWithExistingId() throws Exception {
        // Create the Predmeti with an existing ID
        predmeti.setId(1L);

        int databaseSizeBeforeCreate = predmetiRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPredmetiMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(predmeti)))
            .andExpect(status().isBadRequest());

        // Validate the Predmeti in the database
        List<Predmeti> predmetiList = predmetiRepository.findAll();
        assertThat(predmetiList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPredmetis() throws Exception {
        // Initialize the database
        predmetiRepository.saveAndFlush(predmeti);

        // Get all the predmetiList
        restPredmetiMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(predmeti.getId().intValue())))
            .andExpect(jsonPath("$.[*].nazivPredmeta").value(hasItem(DEFAULT_NAZIV_PREDMETA)))
            .andExpect(jsonPath("$.[*].brojSemestara").value(hasItem(DEFAULT_BROJ_SEMESTARA)));
    }

    @Test
    @Transactional
    void getPredmeti() throws Exception {
        // Initialize the database
        predmetiRepository.saveAndFlush(predmeti);

        // Get the predmeti
        restPredmetiMockMvc
            .perform(get(ENTITY_API_URL_ID, predmeti.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(predmeti.getId().intValue()))
            .andExpect(jsonPath("$.nazivPredmeta").value(DEFAULT_NAZIV_PREDMETA))
            .andExpect(jsonPath("$.brojSemestara").value(DEFAULT_BROJ_SEMESTARA));
    }

    @Test
    @Transactional
    void getNonExistingPredmeti() throws Exception {
        // Get the predmeti
        restPredmetiMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPredmeti() throws Exception {
        // Initialize the database
        predmetiRepository.saveAndFlush(predmeti);

        int databaseSizeBeforeUpdate = predmetiRepository.findAll().size();

        // Update the predmeti
        Predmeti updatedPredmeti = predmetiRepository.findById(predmeti.getId()).get();
        // Disconnect from session so that the updates on updatedPredmeti are not directly saved in db
        em.detach(updatedPredmeti);
        updatedPredmeti.nazivPredmeta(UPDATED_NAZIV_PREDMETA).brojSemestara(UPDATED_BROJ_SEMESTARA);

        restPredmetiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPredmeti.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPredmeti))
            )
            .andExpect(status().isOk());

        // Validate the Predmeti in the database
        List<Predmeti> predmetiList = predmetiRepository.findAll();
        assertThat(predmetiList).hasSize(databaseSizeBeforeUpdate);
        Predmeti testPredmeti = predmetiList.get(predmetiList.size() - 1);
        assertThat(testPredmeti.getNazivPredmeta()).isEqualTo(UPDATED_NAZIV_PREDMETA);
        assertThat(testPredmeti.getBrojSemestara()).isEqualTo(UPDATED_BROJ_SEMESTARA);
    }

    @Test
    @Transactional
    void putNonExistingPredmeti() throws Exception {
        int databaseSizeBeforeUpdate = predmetiRepository.findAll().size();
        predmeti.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPredmetiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, predmeti.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(predmeti))
            )
            .andExpect(status().isBadRequest());

        // Validate the Predmeti in the database
        List<Predmeti> predmetiList = predmetiRepository.findAll();
        assertThat(predmetiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPredmeti() throws Exception {
        int databaseSizeBeforeUpdate = predmetiRepository.findAll().size();
        predmeti.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPredmetiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(predmeti))
            )
            .andExpect(status().isBadRequest());

        // Validate the Predmeti in the database
        List<Predmeti> predmetiList = predmetiRepository.findAll();
        assertThat(predmetiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPredmeti() throws Exception {
        int databaseSizeBeforeUpdate = predmetiRepository.findAll().size();
        predmeti.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPredmetiMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(predmeti)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Predmeti in the database
        List<Predmeti> predmetiList = predmetiRepository.findAll();
        assertThat(predmetiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePredmetiWithPatch() throws Exception {
        // Initialize the database
        predmetiRepository.saveAndFlush(predmeti);

        int databaseSizeBeforeUpdate = predmetiRepository.findAll().size();

        // Update the predmeti using partial update
        Predmeti partialUpdatedPredmeti = new Predmeti();
        partialUpdatedPredmeti.setId(predmeti.getId());

        restPredmetiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPredmeti.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPredmeti))
            )
            .andExpect(status().isOk());

        // Validate the Predmeti in the database
        List<Predmeti> predmetiList = predmetiRepository.findAll();
        assertThat(predmetiList).hasSize(databaseSizeBeforeUpdate);
        Predmeti testPredmeti = predmetiList.get(predmetiList.size() - 1);
        assertThat(testPredmeti.getNazivPredmeta()).isEqualTo(DEFAULT_NAZIV_PREDMETA);
        assertThat(testPredmeti.getBrojSemestara()).isEqualTo(DEFAULT_BROJ_SEMESTARA);
    }

    @Test
    @Transactional
    void fullUpdatePredmetiWithPatch() throws Exception {
        // Initialize the database
        predmetiRepository.saveAndFlush(predmeti);

        int databaseSizeBeforeUpdate = predmetiRepository.findAll().size();

        // Update the predmeti using partial update
        Predmeti partialUpdatedPredmeti = new Predmeti();
        partialUpdatedPredmeti.setId(predmeti.getId());

        partialUpdatedPredmeti.nazivPredmeta(UPDATED_NAZIV_PREDMETA).brojSemestara(UPDATED_BROJ_SEMESTARA);

        restPredmetiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPredmeti.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPredmeti))
            )
            .andExpect(status().isOk());

        // Validate the Predmeti in the database
        List<Predmeti> predmetiList = predmetiRepository.findAll();
        assertThat(predmetiList).hasSize(databaseSizeBeforeUpdate);
        Predmeti testPredmeti = predmetiList.get(predmetiList.size() - 1);
        assertThat(testPredmeti.getNazivPredmeta()).isEqualTo(UPDATED_NAZIV_PREDMETA);
        assertThat(testPredmeti.getBrojSemestara()).isEqualTo(UPDATED_BROJ_SEMESTARA);
    }

    @Test
    @Transactional
    void patchNonExistingPredmeti() throws Exception {
        int databaseSizeBeforeUpdate = predmetiRepository.findAll().size();
        predmeti.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPredmetiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, predmeti.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(predmeti))
            )
            .andExpect(status().isBadRequest());

        // Validate the Predmeti in the database
        List<Predmeti> predmetiList = predmetiRepository.findAll();
        assertThat(predmetiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPredmeti() throws Exception {
        int databaseSizeBeforeUpdate = predmetiRepository.findAll().size();
        predmeti.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPredmetiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(predmeti))
            )
            .andExpect(status().isBadRequest());

        // Validate the Predmeti in the database
        List<Predmeti> predmetiList = predmetiRepository.findAll();
        assertThat(predmetiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPredmeti() throws Exception {
        int databaseSizeBeforeUpdate = predmetiRepository.findAll().size();
        predmeti.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPredmetiMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(predmeti)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Predmeti in the database
        List<Predmeti> predmetiList = predmetiRepository.findAll();
        assertThat(predmetiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePredmeti() throws Exception {
        // Initialize the database
        predmetiRepository.saveAndFlush(predmeti);

        int databaseSizeBeforeDelete = predmetiRepository.findAll().size();

        // Delete the predmeti
        restPredmetiMockMvc
            .perform(delete(ENTITY_API_URL_ID, predmeti.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Predmeti> predmetiList = predmetiRepository.findAll();
        assertThat(predmetiList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
