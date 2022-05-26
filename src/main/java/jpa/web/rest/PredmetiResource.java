package jpa.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import jpa.domain.Predmeti;
import jpa.repository.PredmetiRepository;
import jpa.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link jpa.domain.Predmeti}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PredmetiResource {

    private final Logger log = LoggerFactory.getLogger(PredmetiResource.class);

    private static final String ENTITY_NAME = "predmeti";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PredmetiRepository predmetiRepository;

    public PredmetiResource(PredmetiRepository predmetiRepository) {
        this.predmetiRepository = predmetiRepository;
    }

    /**
     * {@code POST  /predmetis} : Create a new predmeti.
     *
     * @param predmeti the predmeti to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new predmeti, or with status {@code 400 (Bad Request)} if the predmeti has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/predmetis")
    public ResponseEntity<Predmeti> createPredmeti(@RequestBody Predmeti predmeti) throws URISyntaxException {
        log.debug("REST request to save Predmeti : {}", predmeti);
        if (predmeti.getId() != null) {
            throw new BadRequestAlertException("A new predmeti cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Predmeti result = predmetiRepository.save(predmeti);
        return ResponseEntity
            .created(new URI("/api/predmetis/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /predmetis/:id} : Updates an existing predmeti.
     *
     * @param id the id of the predmeti to save.
     * @param predmeti the predmeti to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated predmeti,
     * or with status {@code 400 (Bad Request)} if the predmeti is not valid,
     * or with status {@code 500 (Internal Server Error)} if the predmeti couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/predmetis/{id}")
    public ResponseEntity<Predmeti> updatePredmeti(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Predmeti predmeti
    ) throws URISyntaxException {
        log.debug("REST request to update Predmeti : {}, {}", id, predmeti);
        if (predmeti.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, predmeti.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!predmetiRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Predmeti result = predmetiRepository.save(predmeti);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, predmeti.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /predmetis/:id} : Partial updates given fields of an existing predmeti, field will ignore if it is null
     *
     * @param id the id of the predmeti to save.
     * @param predmeti the predmeti to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated predmeti,
     * or with status {@code 400 (Bad Request)} if the predmeti is not valid,
     * or with status {@code 404 (Not Found)} if the predmeti is not found,
     * or with status {@code 500 (Internal Server Error)} if the predmeti couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/predmetis/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Predmeti> partialUpdatePredmeti(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Predmeti predmeti
    ) throws URISyntaxException {
        log.debug("REST request to partial update Predmeti partially : {}, {}", id, predmeti);
        if (predmeti.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, predmeti.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!predmetiRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Predmeti> result = predmetiRepository
            .findById(predmeti.getId())
            .map(existingPredmeti -> {
                if (predmeti.getNazivPredmeta() != null) {
                    existingPredmeti.setNazivPredmeta(predmeti.getNazivPredmeta());
                }
                if (predmeti.getBrojSemestara() != null) {
                    existingPredmeti.setBrojSemestara(predmeti.getBrojSemestara());
                }

                return existingPredmeti;
            })
            .map(predmetiRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, predmeti.getId().toString())
        );
    }

    /**
     * {@code GET  /predmetis} : get all the predmetis.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of predmetis in body.
     */
    @GetMapping("/predmetis")
    public List<?> getAllPredmetis() {
        log.debug("REST request to get all Predmetis");
        return predmetiRepository.getPredmeti();
    }

    /**
     * {@code GET  /predmetis/:id} : get the "id" predmeti.
     *
     * @param id the id of the predmeti to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the predmeti, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/predmetis/{id}")
    public ResponseEntity<Predmeti> getPredmeti(@PathVariable Long id) {
        log.debug("REST request to get Predmeti : {}", id);
        Optional<Predmeti> predmeti = predmetiRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(predmeti);
    }

    /**
     * {@code DELETE  /predmetis/:id} : delete the "id" predmeti.
     *
     * @param id the id of the predmeti to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/predmetis/{id}")
    public ResponseEntity<Void> deletePredmeti(@PathVariable Long id) {
        log.debug("REST request to delete Predmeti : {}", id);
        predmetiRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
